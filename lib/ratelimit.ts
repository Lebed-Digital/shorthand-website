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
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'rl:welcome-letter-generator',
    analytics: false,
  }),
  'welcome-letter-refine': new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'rl:welcome-letter-refine',
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
