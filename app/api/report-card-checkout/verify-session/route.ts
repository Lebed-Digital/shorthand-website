import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/ratelimit';
import {
  ACCESS_COOKIE_NAME,
  accessCookieOptions,
  verifyAccessToken,
} from '@/lib/report-card-access';
import { callReportCardFunction } from '@/lib/report-card-functions';

// Called by the Stripe success page with the Checkout Session id from the
// redirect. This route is where purchase actually converts into access.
//
// The session id in the URL is NEVER treated as proof of payment on its own.
// It is passed to the fulfill Edge Function, which retrieves the session from
// Stripe with a full-access key and checks status, payment_status, the real
// purchased line item, quantity, amount (499) and currency (usd) before
// minting anything. This route only relays the result and sets the cookie.
//
// Fulfillment is idempotent, so a refresh of the success page is harmless.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface FulfillResponse {
  granted?: boolean;
  reason?: string;
  accessToken?: string;
  isNewPurchase?: boolean;
}

export async function POST(req: Request): Promise<Response> {
  const rl = await checkRateLimit(req, 'report-card-checkout');
  if (rl.blocked) return rl.response!;

  let sessionId: unknown;
  try {
    const body = await req.json();
    sessionId = body?.sessionId;
  } catch {
    return Response.json({ granted: false, reason: 'invalid_request' }, { status: 400 });
  }

  if (typeof sessionId !== 'string' || sessionId.length === 0 || sessionId.length > 200) {
    return Response.json({ granted: false, reason: 'invalid_request' }, { status: 400 });
  }

  const result = await callReportCardFunction<FulfillResponse>(
    'report-card-checkout-fulfill',
    { sessionId }
  );

  if (!result.ok || !result.data) {
    // Transient: the payment may well have succeeded and the webhook will have
    // recorded it, so this is explicitly retryable rather than a denial.
    return Response.json({ granted: false, reason: 'temporarily_unavailable' }, { status: 503 });
  }

  const { granted, reason, accessToken } = result.data;

  if (granted !== true || typeof accessToken !== 'string' || accessToken.length === 0) {
    return Response.json({ granted: false, reason: reason ?? 'not_granted' }, { status: 200 });
  }

  // Verify the token we were handed before setting it. If the two sides ever
  // drift on RCCL_TOKEN_SECRET or wire format, fail here loudly instead of
  // writing a cookie the gate will silently reject on the next page load.
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    console.error('verify-session: fulfill returned a token this environment cannot verify');
    return Response.json({ granted: false, reason: 'temporarily_unavailable' }, { status: 503 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions(payload));

  return Response.json({ granted: true }, { status: 200 });
}
