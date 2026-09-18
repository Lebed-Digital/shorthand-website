import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSignupFragment } from './signup-confirmation.ts';

const valid = '#access_token=access-secret&refresh_token=refresh-secret&expires_at=2000000000&expires_in=3600&token_type=bearer&type=signup';

test('accepts a complete, unexpired signup session', () => {
  assert.deepEqual(parseSignupFragment(valid, 1_900_000_000), { status: 'valid', fragment: valid });
});

test('rejects missing, malformed, expired, and non-signup fragments', () => {
  for (const hash of ['', '#access_token=only', valid.replace('signup', 'recovery'), valid.replace('2000000000', '1000000000'), `${valid}&access_token=duplicate`, '#access_token=%zz']) {
    assert.deepEqual(parseSignupFragment(hash, 1_900_000_000), { status: 'invalid' });
  }
});

test('recognizes a Supabase error fragment without exposing its description', () => {
  assert.deepEqual(parseSignupFragment('#error=access_denied&error_code=otp_expired&error_description=Secret+details'), { status: 'error' });
});
