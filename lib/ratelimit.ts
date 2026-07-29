import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const limiters = {
  'report-card-generator': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 h'),
    prefix: 'rl:report-card-generator',
    analytics: false,
  }),
  'welcome-letter-generator': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'rl:welcome-letter-generator',
    analytics: false,
  }),
  'welcome-letter-refine': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'rl:welcome-letter-refine',
    analytics: false,
  }),
  'report-card-checkout': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'rl:report-card-checkout',
    analytics: false,
  }),
  'report-card-restore': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'rl:report-card-restore',
    analytics: false,
  }),
  // Guards restore-link confirmation. Keyed on a hash of the presented link,
  // NOT on IP, for the same school-NAT reason as report-card-revalidate: the
  // existing IP-keyed report-card-restore limiter (5/h) would block the second
  // teacher in a building who ever needed a restore link.
  //
  // 8 attempts per link per hour is generous for one person clicking an email
  // link and refreshing, while still bounding replay of a single leaked link.
  'report-card-restore-confirm': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(8, '1 h'),
    prefix: 'rl:report-card-restore-confirm',
    analytics: false,
  }),
  // Secondary, deliberately wide per-IP bound on restore confirmation. High
  // enough that a whole staff room clicking their own links never trips it,
  // low enough to stop one host brute-forcing many random tokens.
  'report-card-restore-confirm-ip': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 h'),
    prefix: 'rl:report-card-restore-confirm-ip',
    analytics: false,
  }),
  // Guards the Edge Function revalidation round trip behind the access-refresh
  // route. Keyed per purchase, NOT per IP: a whole school shares one outbound
  // address, and an IP-only limit there would lock out every teacher in the
  // building at once. See checkPurchaseRateLimit below.
  //
  // 12/hour is far above honest use. A legitimate client hits revalidation
  // roughly once per 24 hours, because a locally valid token short-circuits
  // before any network call; the limiter is only consulted when revalidation
  // is genuinely due.
  'report-card-revalidate': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(12, '1 h'),
    prefix: 'rl:report-card-revalidate',
    analytics: false,
  }),
};

export function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

export function rateLimitExceededResponse(tool: string): Response {
  console.log(`[ratelimit] blocked | tool=${tool} | ${new Date().toISOString()}`);
  return Response.json(
    { error: { message: "You've reached the free generation limit. Try again in about an hour." } },
    { status: 429 }
  );
}

// Short, non-reversible identifier for a rate-limit key.
//
// The caller passes an already-verified purchase id, never a raw token. We
// hash anyway so that nothing user-identifying is written into a Redis key or
// a log line, and truncate to 160 bits, which is far past any collision
// concern at this scale.
export async function hashedRateLimitKey(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest).slice(0, 20))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Rate limit keyed by a verified purchase, with IP only as a secondary signal.
//
// Deliberately not IP-primary: teachers at one school share a single outbound
// NAT address, so an IP-only limit on a paid feature would punish an entire
// staff for one noisy device. The purchase id comes from an HMAC-verified
// token, so it cannot be spoofed to another user's bucket, and an attacker
// without a valid token never reaches this code at all.
//
// The IP is folded in as a suffix so that a single leaked token replayed from
// many machines gets a separate bucket per source rather than one shared pool.
// That bounds damage from a shared token without making the school case worse:
// honest users have one purchase and few devices.
//
// NEVER pass the raw access token here. Pass payload.purchaseId.
export async function checkPurchaseRateLimit(
  req: Request,
  tool: keyof typeof limiters,
  purchaseId: string
): Promise<{ blocked: boolean }> {
  const ip = getIP(req);
  const identifier = `${await hashedRateLimitKey(purchaseId)}:${await hashedRateLimitKey(ip)}`;

  try {
    const { success } = await limiters[tool].limit(identifier);
    if (!success) {
      console.log(`[ratelimit] blocked | tool=${tool} | keyed=purchase | ${new Date().toISOString()}`);
      return { blocked: true };
    }
    return { blocked: false };
  } catch (e) {
    // Redis unreachable. Fail open on the limiter itself: this guard exists to
    // bound cost, not to enforce access, and the caller still applies the full
    // access gate afterwards. Failing closed here would turn an Upstash blip
    // into a site-wide lockout of paying customers.
    console.error(`[ratelimit] limiter unavailable | tool=${tool}:`, e instanceof Error ? e.message : String(e));
    return { blocked: false };
  }
}

// Rate limit for restore-link confirmation.
//
// Keyed primarily on a hash of the presented link, so one person retrying
// their own link is bounded without any dependence on their IP. A per-IP
// bound is applied as well, but a deliberately wide one, so a shared school
// address cannot lock out colleagues clicking their own valid links.
//
// The raw token is hashed before it is used as a key and is NEVER logged.
export async function checkRestoreConfirmRateLimit(
  req: Request,
  token: string
): Promise<{ blocked: boolean }> {
  try {
    const [byToken, byIp] = await Promise.all([
      limiters['report-card-restore-confirm'].limit(await hashedRateLimitKey(token)),
      limiters['report-card-restore-confirm-ip'].limit(await hashedRateLimitKey(getIP(req))),
    ]);
    if (!byToken.success || !byIp.success) {
      console.log(
        `[ratelimit] blocked | tool=report-card-restore-confirm | keyed=${!byToken.success ? 'link' : 'ip'} | ${new Date().toISOString()}`
      );
      return { blocked: true };
    }
    return { blocked: false };
  } catch (e) {
    // Fail open, as with checkPurchaseRateLimit: the Edge Function still
    // verifies the link's signature, expiry and the live purchase status, so
    // an Upstash outage must not break restoration for paying customers.
    console.error('[ratelimit] limiter unavailable | tool=report-card-restore-confirm:', e instanceof Error ? e.message : String(e));
    return { blocked: false };
  }
}

export async function checkRateLimit(
  req: Request,
  tool: keyof typeof limiters
): Promise<{ blocked: boolean; response?: Response }> {
  const ip = getIP(req);
  const identifier = `${ip}`;
  const { success } = await limiters[tool].limit(identifier);

  if (!success) {
    console.log(`[ratelimit] blocked | tool=${tool} | ip_prefix=${ip.slice(0, 8)} | ${new Date().toISOString()}`);
    return { blocked: true, response: rateLimitExceededResponse(tool) };
  }

  console.log(`[ratelimit] allowed | tool=${tool} | ${new Date().toISOString()}`);
  return { blocked: false };
}
