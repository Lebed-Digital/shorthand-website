import { cookies } from 'next/headers';
import {
  ACCESS_COOKIE_NAME,
  isRevalidationDue,
  verifyAccessToken,
  type AccessTokenPayload,
} from './report-card-access';
import { callReportCardFunction } from './report-card-functions';

// Server-side access decision for the gated library page.
//
// The full state table is in docs/report-card-comment-library-handoff.md §13.9
// and is binding:
//
//  | token state                          | revalidate result | behavior                                   |
//  |--------------------------------------|-------------------|--------------------------------------------|
//  | valid, revalidateAfter not passed    | (not called)      | grant, no network call                     |
//  | valid, revalidation due              | valid: true       | grant, needs fresh token                   |
//  | valid, revalidation due              | not_paid          | deny, clear cookie                         |
//  | valid, revalidation due              | lookup_failed     | grant on EXISTING token, leave it untouched|
//  | valid, revalidation due, throttled   | (not called)      | grant on EXISTING token, leave it untouched|
//  | past exp / bad signature / malformed | (not called)      | deny, even if Supabase is unavailable      |
//  | no cookie                            | (not called)      | deny                                       |
//
// The rule that matters most: NEVER mint a fresh token after lookup_failed.
// If the gate refreshed the token on every transient database error, anyone
// able to induce or simply wait out a Supabase error could renew access
// indefinitely and the 30-day hard expiry would never bite. Access continues
// on the existing token only, so it still dies at its original exp, and
// because revalidateAfter is left stale the next render retries revalidation
// and the system heals itself once Supabase recovers.

export type GateDecision =
  | { access: true; freshToken?: string; payload: AccessTokenPayload }
  | { access: false; clearCookie: boolean };

interface RevalidateResponse {
  valid?: boolean;
  reason?: string;
  accessToken?: string;
}

// Optional guard consulted ONLY when revalidation is actually due, i.e. only
// when the gate is about to make an Edge Function call. A locally valid token
// whose revalidateAfter has not passed never reaches this, so ordinary reading
// is never rate limited.
//
// Returning true means "do not make the network call right now". The gate then
// takes the same bounded fallback as lookup_failed: access continues on the
// EXISTING token, nothing is minted or extended, revalidateAfter stays stale
// so the next render retries. A rate-limited caller therefore cannot use the
// limiter to dodge revocation or outlive the 30-day hard expiry.
export type RevalidationThrottle = (payload: AccessTokenPayload) => Promise<boolean>;

export async function evaluateAccess(throttle?: RevalidationThrottle): Promise<GateDecision> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!raw) {
    return { access: false, clearCookie: false };
  }

  // Local HMAC + hard-expiry check happens first and is decisive on its own.
  // An expired or tampered token is rejected here without any network call,
  // so a Supabase outage can never rescue an invalid token.
  const payload = await verifyAccessToken(raw);
  if (!payload) {
    return { access: false, clearCookie: true };
  }

  if (!isRevalidationDue(payload)) {
    return { access: true, payload };
  }

  // Revalidation is due, so this is the only place a network call happens and
  // the only place the throttle applies. Treated exactly like lookup_failed:
  // keep the customer in, mint nothing, retry next render.
  if (throttle && (await throttle(payload))) {
    return { access: true, payload };
  }

  const result = await callReportCardFunction<RevalidateResponse>(
    'report-card-access-revalidate',
    { purchaseId: payload.purchaseId }
  );

  // Transport-level failure (network, timeout, 401, non-JSON). Indistinguishable
  // from lookup_failed from the gate's point of view, and handled identically:
  // keep the customer in, change nothing about the token.
  if (!result.ok || !result.data) {
    return { access: true, payload };
  }

  const { valid, reason, accessToken } = result.data;

  if (valid === true && typeof accessToken === 'string' && accessToken.length > 0) {
    return { access: true, freshToken: accessToken, payload };
  }

  // Only an explicit not_paid revokes. The purchase was found and is refunded,
  // revoked, or gone.
  if (reason === 'not_paid') {
    return { access: false, clearCookie: true };
  }

  // lookup_failed, server_misconfigured, or any unexpected shape: treat as
  // transient. Grant on the existing token, mint nothing, retry next render.
  return { access: true, payload };
}
