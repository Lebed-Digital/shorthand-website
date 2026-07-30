// Shared HMAC access-token scheme for the Report Card Comment Library.
//
// A token is: base64url(payload) + "." + base64url(hmacSha256(payload))
// where payload is JSON: { purchaseId, exp, revalidateAfter } (unix seconds).
//
// Access model (decided 2026-07-28):
//   - exp:             30 days. Hard expiry; after this the token is dead.
//   - revalidateAfter: 24 hours. Before this passes, the gated page grants
//                      access on local HMAC verification alone (no network).
//                      After it passes, the page must confirm with Supabase
//                      that the purchase is still status='paid' and reissue
//                      a fresh token, or clear the cookie and show the
//                      paywall.
//
// This is what makes 'refunded'/'revoked' in report_card_purchases actually
// remove access (within 24h worst case) instead of being decorative.
//
// This module runs under Deno (Edge Functions). The Vercel-side verifier in
// lib/report-card-access.ts implements the identical wire format using the
// same RCCL_TOKEN_SECRET, so a token minted here verifies there. Keep the
// two in lockstep if this format ever changes.

export interface AccessTokenPayload {
  purchaseId: string;
  exp: number;
  revalidateAfter: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

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

export async function signAccessToken(
  payload: AccessTokenPayload,
  secret: string
): Promise<string> {
  const key = await importHmacKey(secret);
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const signature = await crypto.subtle.sign('HMAC', key, payloadBytes);
  return `${base64UrlEncode(payloadBytes)}.${base64UrlEncode(new Uint8Array(signature))}`;
}

// Verifies signature and hard expiry only. It deliberately does NOT enforce
// revalidateAfter: the caller decides what to do when revalidation is due,
// because the correct action differs between the gated page (revalidate and
// reissue) and the restore-confirm path (mint a brand new token anyway).
export async function verifyAccessToken(
  token: string,
  secret: string
): Promise<AccessTokenPayload | null> {
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
  const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, payloadBytes);
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
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days (hard expiry)
export const ACCESS_REVALIDATE_SECONDS = 60 * 60 * 24; // 24 hours (paid-status recheck)
export const RESTORE_TOKEN_TTL_SECONDS = 60 * 30; // 30 minutes (emailed restore link)

// Single place that builds a fresh access-token payload, so the fulfill,
// restore-confirm, and revalidate paths cannot drift on TTLs.
export function newAccessTokenPayload(purchaseId: string): AccessTokenPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    purchaseId,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
    revalidateAfter: now + ACCESS_REVALIDATE_SECONDS,
  };
}
