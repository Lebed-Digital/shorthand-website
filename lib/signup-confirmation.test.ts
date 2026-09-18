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

// Supabase's /verify appends `sb=` to the token fragment. Observed on a real
// iOS signup 2026-09-18, which failed with unexpected_key:sb before this was
// tolerated. These lock in that one allowance without widening the parser.

// The exact shape observed in production, key order included.
const withSb = '#access_token=access-secret&expires_at=2000000000&expires_in=3600&refresh_token=refresh-secret&sb=&token_type=bearer&type=signup';

test('accepts the real Supabase callback shape carrying an empty sb', () => {
  assert.deepEqual(parseSignupFragment(withSb, 1_900_000_000), { status: 'valid', fragment: valid });
});

test('never forwards sb to the native handoff fragment', () => {
  const result = parseSignupFragment(withSb, 1_900_000_000);
  assert.equal(result.status, 'valid');
  const forwarded = (result as { fragment: string }).fragment;
  assert.equal(forwarded.includes('sb'), false);
  assert.deepEqual([...new URLSearchParams(forwarded.slice(1)).keys()].sort(),
    ['access_token', 'expires_at', 'expires_in', 'refresh_token', 'token_type', 'type']);
});

test('rejects duplicate or non-empty sb, and still rejects other unknown keys', () => {
  for (const hash of [
    `${withSb}&sb=`,                               // duplicate sb
    withSb.replace('sb=&', 'sb=something&'),       // non-empty sb
    `${valid}&sbx=`,                               // near-miss key
    `${valid}&provider_token=abc`,                 // other unknown key
    `${valid}&sb=&provider_token=abc`,             // sb does not excuse another unknown key
  ]) {
    assert.deepEqual(parseSignupFragment(hash, 1_900_000_000), { status: 'invalid' }, `should reject: ${hash}`);
  }
});

test('a signup callback without sb remains valid', () => {
  assert.deepEqual(parseSignupFragment(valid, 1_900_000_000), { status: 'valid', fragment: valid });
});

test('sb does not bypass any other validation rule', () => {
  for (const hash of [
    withSb.replace('type=signup', 'type=email'),       // wrong type
    withSb.replace('2000000000', '1000000000'),        // expired
    withSb.replace('token_type=bearer', 'token_type=mac'),
    withSb.replace('expires_in=3600', 'expires_in=0'),
  ]) {
    assert.deepEqual(parseSignupFragment(hash, 1_900_000_000), { status: 'invalid' }, `should reject: ${hash}`);
  }
});
