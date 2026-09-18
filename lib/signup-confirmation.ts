export type ConfirmationResult =
  | { status: 'valid'; fragment: string }
  | { status: 'error' | 'invalid' };

const fields = ['access_token', 'refresh_token', 'expires_at', 'expires_in', 'token_type', 'type'] as const;

export function parseSignupFragment(hash: string, nowSeconds = Math.floor(Date.now() / 1000)): ConfirmationResult {
  if (!hash.startsWith('#') || hash.length < 2 || /%(?![\da-fA-F]{2})/.test(hash)) {
    return { status: 'invalid' };
  }

  const params = new URLSearchParams(hash.slice(1));
  if (params.has('error') || params.has('error_code') || params.has('error_description')) {
    return { status: 'error' };
  }

  if ([...params.keys()].some((key) => !fields.includes(key as typeof fields[number]))) {
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

// --- TEMPORARY DIAGNOSTICS (remove once the real callback shape is known) ---
// Structural only. Never reads a token's VALUE: it reports key names, presence
// booleans, and a small set of enumerated safe values (type, token_type, error
// codes). Anything not on the allowlist is reported as a shape, not a value.

/** Values safe to echo verbatim. Everything else is redacted to a shape. */
const safeTypeValues = ['signup', 'email', 'magiclink', 'recovery', 'invite', 'email_change', 'sms', 'phone_change'];
const safeTokenTypes = ['bearer'];
// Supabase error codes are short, non-secret, documented enums.
const safeErrorCodePattern = /^[a-z0-9_]{1,40}$/;

/** Redact any unrecognized value down to a non-reversible shape descriptor. */
function shapeOf(value: string): string {
  const cls = /^\d+$/.test(value) ? 'digits' : /^[A-Za-z0-9._~-]+$/.test(value) ? 'urlsafe' : 'other';
  return `<${cls}:len=${value.length}>`;
}

function safeValue(value: string, allowlist: string[]): string {
  const normalized = value.toLowerCase();
  return allowlist.includes(normalized) ? normalized : shapeOf(value);
}

export type FragmentDiagnostics = {
  status: 'valid' | 'error' | 'invalid';
  reasons: string[];
  keys: string[];
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  hasExpiresIn: boolean;
  hasExpiresAt: boolean;
  type: string | null;
  tokenType: string | null;
};

export function diagnoseFragment(hash: string, nowSeconds = Math.floor(Date.now() / 1000)): FragmentDiagnostics {
  const empty: FragmentDiagnostics = {
    status: 'invalid', reasons: [], keys: [],
    hasAccessToken: false, hasRefreshToken: false, hasExpiresIn: false, hasExpiresAt: false,
    type: null, tokenType: null,
  };

  if (!hash || hash === '#') return { ...empty, reasons: ['missing_fragment'] };
  if (!hash.startsWith('#')) return { ...empty, reasons: ['fragment_no_leading_hash'] };
  if (/%(?![\da-fA-F]{2})/.test(hash)) return { ...empty, reasons: ['malformed_percent_encoding'] };

  const params = new URLSearchParams(hash.slice(1));
  const keys = [...new Set(params.keys())].sort();
  const base: FragmentDiagnostics = {
    ...empty,
    keys,
    hasAccessToken: params.has('access_token'),
    hasRefreshToken: params.has('refresh_token'),
    hasExpiresIn: params.has('expires_in'),
    hasExpiresAt: params.has('expires_at'),
    type: params.has('type') ? safeValue(params.get('type')!, safeTypeValues) : null,
    tokenType: params.has('token_type') ? safeValue(params.get('token_type')!, safeTokenTypes) : null,
  };

  if (params.has('error') || params.has('error_code') || params.has('error_description')) {
    const raw = params.get('error_code') ?? params.get('error') ?? 'unspecified';
    const code = safeErrorCodePattern.test(raw) ? raw : shapeOf(raw);
    return { ...base, status: 'error', reasons: [`supabase_error:${code}`] };
  }

  const reasons: string[] = [];
  for (const key of keys) {
    if (!fields.includes(key as typeof fields[number])) reasons.push(`unexpected_key:${key}`);
    if (params.getAll(key).length > 1) reasons.push(`duplicate_key:${key}`);
  }
  for (const key of fields) {
    if (params.getAll(key).length === 0) reasons.push(`missing_${key}`);
    else if (!params.get(key)) reasons.push(`empty_${key}`);
  }

  const type = params.get('type');
  if (type && type !== 'signup') reasons.push('wrong_type');
  const tokenType = params.get('token_type');
  if (tokenType && tokenType.toLowerCase() !== 'bearer') reasons.push('wrong_token_type');

  const expiresIn = params.get('expires_in');
  if (expiresIn && !/^[1-9]\d*$/.test(expiresIn)) reasons.push('expires_in_not_a_positive_integer');
  const expiresAt = params.get('expires_at');
  if (expiresAt) {
    if (!/^[1-9]\d*$/.test(expiresAt)) reasons.push('expires_at_not_a_positive_integer');
    else if (Number(expiresAt) <= nowSeconds) reasons.push('expired');
  }

  const accessToken = params.get('access_token');
  if (accessToken && !/^[^\s&#]+$/.test(accessToken)) reasons.push('access_token_has_whitespace_or_delimiter');
  const refreshToken = params.get('refresh_token');
  if (refreshToken && !/^[^\s&#]+$/.test(refreshToken)) reasons.push('refresh_token_has_whitespace_or_delimiter');

  const status = parseSignupFragment(hash, nowSeconds).status;
  return { ...base, status, reasons: status === 'valid' ? [] : reasons };
}
