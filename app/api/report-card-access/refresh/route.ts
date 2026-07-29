import { cookies } from 'next/headers';
import { checkPurchaseRateLimit } from '@/lib/ratelimit';
import {
  ACCESS_COOKIE_NAME,
  accessCookieOptions,
  clearedAccessCookieOptions,
  verifyAccessToken,
} from '@/lib/report-card-access';
import { evaluateAccess } from '@/lib/report-card-gate';

// Cookie-writing companion to the gated page.
//
// Server Components cannot set cookies during render (Next.js sends headers
// before the render completes), so the page performs the access decision and,
// when that decision produces a fresh token or a revocation, a small client
// component pings this route to persist it.
//
// This route does NOT trust anything from the client. It takes no request body
// at all: it re-runs the exact same evaluateAccess() gate against the incoming
// cookie and writes whatever that returns. A caller can therefore only ever
// cause the state their own cookie already justifies.

// Abuse protection: this route is unauthenticated by necessity (it is what
// establishes whether the caller is authenticated), and each call with a stale
// token drives one Supabase Edge Function invocation. Left unguarded, anyone
// holding a single valid-but-stale token could loop here and burn function
// quota against the same project that serves the app.
//
// The guard is keyed on the HMAC-verified purchase id rather than IP, because
// a school shares one outbound address and an IP-only limit would punish an
// entire staff room. It is applied ONLY when revalidation is actually due, so
// normal reading with a locally valid token is never throttled. See
// checkPurchaseRateLimit in lib/ratelimit.ts.
//
// Being throttled never mints or extends access. It is handled exactly like a
// transient lookup_failed: the existing token keeps working until its original
// hard exp, and nothing is refreshed.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  const decision = await evaluateAccess((payload) => {
    return checkPurchaseRateLimit(req, 'report-card-revalidate', payload.purchaseId).then(
      (r) => r.blocked
    );
  });
  const cookieStore = await cookies();

  if (!decision.access) {
    if (decision.clearCookie) {
      cookieStore.set(ACCESS_COOKIE_NAME, '', clearedAccessCookieOptions);
    }
    return Response.json({ access: false }, { status: 200 });
  }

  if (decision.freshToken) {
    const payload = await verifyAccessToken(decision.freshToken);
    if (payload) {
      cookieStore.set(ACCESS_COOKIE_NAME, decision.freshToken, accessCookieOptions(payload));
    }
  }

  return Response.json({ access: true }, { status: 200 });
}
