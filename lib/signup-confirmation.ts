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
