import { checkRestoreConfirmRateLimit } from '@/lib/ratelimit';
import {
  ACCESS_COOKIE_NAME,
  accessCookieOptions,
  verifyAccessToken,
} from '@/lib/report-card-access';
import { callReportCardFunction } from '@/lib/report-card-functions';

// Restore-confirm. This is the landing point for the signed link in a
// restoration email, so it is reached as a top-level GET navigation from a
// mail client, not a fetch.
//
// It is a Route Handler rather than a page because it has to write the access
// cookie, which a Server Component cannot do during render. It sets the cookie
// and issues the redirect in a single response.
//
// The token in the URL is NEVER trusted as proof of purchase on its own. It is
// forwarded to the private report-card-access-restore Edge Function with
// action: 'confirm'. That function verifies the signature and 30-minute expiry
// against RCCL_TOKEN_SECRET, then re-checks the purchase row's live status,
// and only then mints a real 30-day access token. This route is a relay: it
// performs no database access and holds no Supabase key of any kind.
//
// Failure is deliberately opaque. Every unsuccessful outcome lands on the same
// generic page, distinguishing only "try again later" (transient) from "this
// link did not work" (definitive). Internal reasons are logged, never
// reflected to the visitor, so the URL cannot be used to probe whether a given
// purchase exists, was refunded, or was revoked.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LIBRARY_PATH = '/report-card-comment-library';
const FAILURE_PATH = '/report-card-comment-library/restore/failed';

interface ConfirmResponse {
  granted?: boolean;
  reason?: string;
  accessToken?: string;
}

function redirectTo(req: Request, path: string, cookie?: string): Response {
  const headers = new Headers({ Location: new URL(path, req.url).toString() });
  if (cookie) headers.append('Set-Cookie', cookie);
  // 303: the browser must follow with a GET, and the restore link should not
  // be re-submitted if the user refreshes the destination.
  return new Response(null, { status: 303, headers });
}

// Built by hand rather than via cookies().set() so that the Set-Cookie header
// and the redirect leave in the same response. Flags mirror accessCookieOptions
// exactly; see lib/report-card-access.ts for why each one is what it is.
function serializeAccessCookie(token: string, maxAge: number): string {
  const parts = [
    `${ACCESS_COOKIE_NAME}=${token}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

export async function GET(req: Request): Promise<Response> {
  const token = new URL(req.url).searchParams.get('token');

  // Malformed or absent token: never forwarded to the Edge Function at all,
  // and checked before the rate limiter so junk requests cannot consume a
  // legitimate link's budget.
  if (typeof token !== 'string' || token.length === 0 || token.length > 2000) {
    return redirectTo(req, `${FAILURE_PATH}?e=link`);
  }

  // Keyed on a hash of the link itself, with only a wide secondary per-IP
  // bound. An IP-primary limit here would mean the second teacher in a school
  // to click a restore link gets blocked by the first, which is exactly the
  // shared-NAT failure this feature must avoid.
  const rl = await checkRestoreConfirmRateLimit(req, token);
  if (rl.blocked) return redirectTo(req, `${FAILURE_PATH}?e=busy`);

  const result = await callReportCardFunction<ConfirmResponse>('report-card-access-restore', {
    action: 'confirm',
    token,
  });

  // Transport-level failure: network error, timeout, non-2xx, non-JSON. The
  // purchase may well be perfectly valid, so this must not be presented as a
  // bad link.
  if (!result.ok || !result.data) {
    return redirectTo(req, `${FAILURE_PATH}?e=busy`);
  }

  const { granted, reason, accessToken } = result.data;

  if (granted !== true || typeof accessToken !== 'string' || accessToken.length === 0) {
    // lookup_failed means the database query itself failed, which is transient
    // and retryable. Everything else (not_paid, invalid_or_expired_token,
    // invalid_token, server_misconfigured) is definitive: the answer will not
    // change on a retry. The visitor sees only "busy" or "link", never which.
    const transient = reason === 'lookup_failed';
    console.error(`restore-confirm: not granted (reason=${reason ?? 'unknown'})`);
    return redirectTo(req, `${FAILURE_PATH}?e=${transient ? 'busy' : 'link'}`);
  }

  // Verify the token we were handed before setting it. If Vercel and Supabase
  // ever drift on RCCL_TOKEN_SECRET or the wire format, fail loudly here
  // instead of writing a cookie the gate would silently reject on the very
  // next page load, which would look like a broken restore link.
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    console.error('restore-confirm: restore returned a token this environment cannot verify');
    return redirectTo(req, `${FAILURE_PATH}?e=busy`);
  }

  const { maxAge } = accessCookieOptions(payload);
  return redirectTo(req, LIBRARY_PATH, serializeAccessCookie(accessToken, maxAge));
}
