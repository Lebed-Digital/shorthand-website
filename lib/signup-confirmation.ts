export type ConfirmationResult =
  | { status: 'valid'; fragment: string }
  | { status: 'error' | 'invalid' };

const fields = ['access_token', 'refresh_token', 'expires_at', 'expires_in', 'token_type', 'type'] as const;

// Supabase's /verify endpoint appends `sb=` (always empty) to the token
// fragment as a marker for its own redirects. Observed on a real iOS signup
// 2026-09-18. It is tolerated so the callback validates, but deliberately not
// forwarded to the native app, which expects only the session fields above.
const ignoredFields = ['sb'] as const;
const allowedFields: readonly string[] = [...fields, ...ignoredFields];

export function parseSignupFragment(hash: string, nowSeconds = Math.floor(Date.now() / 1000)): ConfirmationResult {
  if (!hash.startsWith('#') || hash.length < 2 || /%(?![\da-fA-F]{2})/.test(hash)) {
    return { status: 'invalid' };
  }

  const params = new URLSearchParams(hash.slice(1));
  if (params.has('error') || params.has('error_code') || params.has('error_description')) {
    return { status: 'error' };
  }

  if ([...params.keys()].some((key) => !allowedFields.includes(key))) {
    return { status: 'invalid' };
  }
  // Exactly one `sb`, and only ever empty. Anything else is not the marker.
  if (ignoredFields.some((key) => params.getAll(key).length > 1 || params.getAll(key).some((value) => value !== ''))) {
    return { status: 'invalid' };
  }
  if (fields.some((key) => params.getAll(key).length !== 1 || !params.get(key))) {
    return { status: 'invalid' };
  }

  const accessToken = params.get('access_token')!;
  const refreshToken = params.get('refresh_token')!;
  const expiresAt = params.get('expires_at')!;
  const expiresIn = params.get('expires_in')!;
  if (
    params.get('type') !== 'signup' ||
    params.get('token_type')?.toLowerCase() !== 'bearer' ||
    !/^[^\s&#]+$/.test(accessToken) ||
    !/^[^\s&#]+$/.test(refreshToken) ||
    !/^[1-9]\d*$/.test(expiresIn) ||
    !/^[1-9]\d*$/.test(expiresAt) ||
    Number(expiresAt) <= nowSeconds ||
    !Number.isSafeInteger(Number(expiresAt)) ||
    !Number.isSafeInteger(Number(expiresIn))
  ) {
    return { status: 'invalid' };
  }

  const validated = new URLSearchParams();
  for (const key of fields) validated.set(key, params.get(key)!);
  return { status: 'valid', fragment: `#${validated.toString()}` };
}
