import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSignupFragment, diagnoseFragment } from './signup-confirmation.ts';

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

// --- TEMPORARY DIAGNOSTICS TESTS (remove with the diagnostics) ---

const ACCESS = 'eyJhbGciOiJIUzI1NiJ9.SUPERSECRETACCESSVALUE.sig';
const REFRESH = 'v1MrSUPERSECRETREFRESHVALUE';
const PROVIDER = 'PROVIDERSECRETVALUE';

/** Every string a diagnostics object can put on screen. */
function renderedStrings(d: ReturnType<typeof diagnoseFragment>): string {
  return [d.status, ...d.reasons, ...d.keys, String(d.hasAccessToken), String(d.hasRefreshToken),
    String(d.hasExpiresIn), String(d.hasExpiresAt), d.type ?? '', d.tokenType ?? ''].join(' | ');
}

test('diagnostics never expose token values, for any fragment shape', () => {
  const now = 1_900_000_000;
  const fragments = [
    `#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=signup`,
    `#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=email`,
    `#access_token=${ACCESS}&refresh_token=${REFRESH}&provider_token=${PROVIDER}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=signup`,
    `#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=1000000000&expires_in=3600&token_type=bearer&type=signup`,
    `#access_token=${ACCESS}`,
    `#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid`,
    `#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=2000000000&expires_in=3600&token_type=Bearer&type=signup`,
  ];
  for (const hash of fragments) {
    const rendered = renderedStrings(diagnoseFragment(hash, now));
    for (const secret of [ACCESS, REFRESH, PROVIDER, 'SUPERSECRETACCESSVALUE', 'SUPERSECRETREFRESHVALUE', 'PROVIDERSECRETVALUE']) {
      assert.equal(rendered.includes(secret), false, `leaked a secret for ${hash.slice(0, 40)}: ${rendered}`);
    }
    // Nothing long enough to be a credential should survive either.
    for (const word of rendered.split(/[\s|,]+/)) {
      assert.ok(word.length < 40, `suspiciously long diagnostic token: ${word}`);
    }
  }
});

test('diagnostics report safe structural facts and reason codes', () => {
  const now = 1_900_000_000;

  const wrongType = diagnoseFragment(`#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=email`, now);
  assert.equal(wrongType.status, 'invalid');
  assert.ok(wrongType.reasons.includes('wrong_type'));
  assert.equal(wrongType.type, 'email');           // safe enumerated value, echoed
  assert.equal(wrongType.tokenType, 'bearer');
  assert.equal(wrongType.hasAccessToken, true);
  assert.equal(wrongType.hasRefreshToken, true);
  assert.deepEqual(wrongType.keys, ['access_token', 'expires_at', 'expires_in', 'refresh_token', 'token_type', 'type']);

  const extra = diagnoseFragment(`#access_token=${ACCESS}&refresh_token=${REFRESH}&provider_token=${PROVIDER}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=signup`, now);
  assert.ok(extra.reasons.includes('unexpected_key:provider_token'));

  const missing = diagnoseFragment('', now);
  assert.deepEqual(missing.reasons, ['missing_fragment']);
  assert.deepEqual(missing.keys, []);

  const expired = diagnoseFragment(`#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=1000000000&expires_in=3600&token_type=bearer&type=signup`, now);
  assert.ok(expired.reasons.includes('expired'));

  const partial = diagnoseFragment(`#access_token=${ACCESS}`, now);
  assert.ok(partial.reasons.includes('missing_refresh_token'));
  assert.equal(partial.hasRefreshToken, false);

  const errored = diagnoseFragment('#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid', now);
  assert.equal(errored.status, 'error');
  assert.deepEqual(errored.reasons, ['supabase_error:otp_expired']);

  const valid = diagnoseFragment(`#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=signup`, now);
  assert.equal(valid.status, 'valid');
  assert.deepEqual(valid.reasons, []);
});

test('an unrecognized type or error code is redacted to a shape, not echoed', () => {
  const now = 1_900_000_000;
  const weird = diagnoseFragment(`#access_token=${ACCESS}&refresh_token=${REFRESH}&expires_at=2000000000&expires_in=3600&token_type=bearer&type=SECRETLOOKINGVALUE`, now);
  assert.equal(weird.type, '<urlsafe:len=18>');
  assert.equal(weird.type!.includes('SECRETLOOKING'), false);

  const weirdErr = diagnoseFragment('#error_code=' + encodeURIComponent('has spaces AND CAPS'), now);
  assert.equal(weirdErr.reasons[0]!.includes('has spaces'), false);
  assert.match(weirdErr.reasons[0]!, /^supabase_error:<other:len=19>$/);
});

test('diagnostics do not alter parseSignupFragment behavior', () => {
  const now = 1_900_000_000;
  for (const hash of [valid, '', '#access_token=only', '#error=access_denied', valid.replace('signup', 'email')]) {
    const before = parseSignupFragment(hash, now);
    diagnoseFragment(hash, now);
    assert.deepEqual(parseSignupFragment(hash, now), before);
  }
});
