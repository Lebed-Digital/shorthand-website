// Vercel-side counterpart to supabase/functions/_shared/access-token.ts.
//
// The wire format is identical and deliberately duplicated rather than shared:
// that module runs under Deno inside Supabase Edge Functions, this one runs
// under Node on Vercel. Both use Web Crypto and the same RCCL_TOKEN_SECRET, so
// a token minted in either place verifies in the other. If the format ever
// changes, change BOTH files together.
//
//   token = base64url(payload) + "." + base64url(HMAC-SHA256(payload))
//   payload = { purchaseId, exp, revalidateAfter }   (unix seconds)
//
// Access model (see docs/report-card-comment-library-handoff.md §13.9):
//   exp             30 days, hard expiry, decisive on its own
//   revalidateAfter 24 hours, after which the paid status is rechecked

export interface AccessTokenPayload {
  purchaseId: string;
  exp: number;
  revalidateAfter: number;
}

export const ACCESS_COOKIE_NAME = 'rccl_access';

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const withPad = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(withPad);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function getTokenSecret(): string {
  const secret = process.env.RCCL_TOKEN_SECRET;
  if (!secret) {
    throw new Error('RCCL_TOKEN_SECRET is not configured.');
  }
  return secret;
}

// Verifies signature and hard expiry only. It deliberately does NOT enforce
// revalidateAfter, mirroring the Deno implementation: the caller decides what
// to do when revalidation is due, because the gated page (revalidate, then
// reissue or revoke) and the restore-confirm path need different behavior.
//
// Returns null for anything untrustworthy: wrong shape, bad signature, past
// exp, malformed base64, non-JSON payload, or a missing secret. A null result
// always means "show the paywall" and is never rescued by a Supabase outage.
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  let secret: string;
  try {
    secret = getTokenSecret();
  } catch {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadPart, signaturePart] = parts;
  let payloadBytes: Uint8Array<ArrayBuffer>;
  let signatureBytes: Uint8Array<ArrayBuffer>;
  try {
    payloadBytes = base64UrlDecode(payloadPart);
    signatureBytes = base64UrlDecode(signaturePart);
  } catch {
    return null;
  }

  const key = await importHmacKey(secret);
  let valid: boolean;
  try {
    valid = await crypto.subtle.verify('HMAC', key, signatureBytes, payloadBytes);
  } catch {
    return null;
  }
  if (!valid) return null;

  let payload: AccessTokenPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return null;
  }

  if (
    typeof payload.purchaseId !== 'string' ||
    typeof payload.exp !== 'number' ||
    typeof payload.revalidateAfter !== 'number'
  ) {
    return null;
  }

  if (payload.exp < nowSeconds()) return null;

  return payload;
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function isRevalidationDue(payload: AccessTokenPayload): boolean {
  return payload.revalidateAfter <= nowSeconds();
}

// Cookie options for the access token.
//
// httpOnly: client JavaScript must never read the token, so an XSS bug cannot
//           exfiltrate access.
// secure:   HTTPS only in production. Left off locally so http://localhost
//           development still works; NODE_ENV is build-time, not user input.
// sameSite lax: the Stripe success redirect is a top-level cross-site GET back
//           to our domain, which 'lax' allows and 'strict' would not.
// maxAge:   tied to the token's own hard expiry so the browser drops the
//           cookie at the same moment the signature stops verifying.
export function accessCookieOptions(payload: AccessTokenPayload) {
  const maxAge = Math.max(0, payload.exp - nowSeconds());
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export const clearedAccessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0,
};
