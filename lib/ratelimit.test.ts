import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// The module builds an Upstash client at import time, so give it credentials
// that are never actually dialled: every test replaces limiters[tool].limit
// with a stub before calling in.
process.env.UPSTASH_REDIS_REST_URL ??= 'https://example.invalid';
process.env.UPSTASH_REDIS_REST_TOKEN ??= 'test-token';

type RateLimitModule = typeof import('./ratelimit.ts');
let mod: RateLimitModule;

before(async () => {
  mod = await import('./ratelimit.ts');
});

const req = () => new Request('https://getshorthandapp.com/api/free-tool', {
  headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
});

// Swap one limiter's limit() for a stub and record what it was called with.
function stubLimiter(tool: keyof RateLimitModule['limiters'], impl: (id: string) => Promise<{ success: boolean }>) {
  const calls: string[] = [];
  mod.limiters[tool].limit = (async (id: string) => {
    calls.push(id);
    return impl(id);
  }) as typeof mod.limiters[typeof tool]['limit'];
  return calls;
}

let originalError: typeof console.error;
beforeEach(() => {
  originalError = console.error;
});

test('allows a request when the limiter says success, keyed on the leftmost forwarded IP', async () => {
  const calls = stubLimiter('report-card-generator', async () => ({ success: true }));
  const result = await mod.checkRateLimit(req(), 'report-card-generator');

  assert.equal(result.blocked, false);
  assert.equal(result.response, undefined);
  assert.deepEqual(calls, ['203.0.113.7']);
});

test('blocks with a 429 when the limiter says the bucket is spent', async () => {
  stubLimiter('welcome-letter-generator', async () => ({ success: false }));
  const result = await mod.checkRateLimit(req(), 'welcome-letter-generator');

  assert.equal(result.blocked, true);
  assert.equal(result.response?.status, 429);
  const body = await result.response!.json();
  assert.match(body.error.message, /free generation limit/);
});

test('fails open instead of throwing when Upstash is unreachable', async () => {
  stubLimiter('welcome-letter-refine', async () => {
    throw new Error('fetch failed: ECONNREFUSED');
  });

  const logged: unknown[] = [];
  console.error = (...args: unknown[]) => { logged.push(args); };
  try {
    const result = await mod.checkRateLimit(req(), 'welcome-letter-refine');
    assert.equal(result.blocked, false);
    assert.equal(result.response, undefined);
  } finally {
    console.error = originalError;
  }

  assert.equal(logged.length, 1, 'the outage should still be logged server-side');
});

test('checkout-session creation also survives an Upstash outage', async () => {
  stubLimiter('report-card-checkout', async () => {
    throw new Error('Upstash 503');
  });

  console.error = () => {};
  try {
    assert.equal((await mod.checkRateLimit(req(), 'report-card-checkout')).blocked, false);
  } finally {
    console.error = originalError;
  }
});

// Guard the paid-path helpers against regression: they already failed open,
// and this change must not alter them.
test('checkPurchaseRateLimit still blocks and still fails open, unchanged', async () => {
  stubLimiter('report-card-revalidate', async () => ({ success: false }));
  assert.equal((await mod.checkPurchaseRateLimit(req(), 'report-card-revalidate', 'purchase_123')).blocked, true);

  stubLimiter('report-card-revalidate', async () => { throw new Error('down'); });
  console.error = () => {};
  try {
    assert.equal((await mod.checkPurchaseRateLimit(req(), 'report-card-revalidate', 'purchase_123')).blocked, false);
  } finally {
    console.error = originalError;
  }
});

test('checkPurchaseRateLimit keys on hashed purchase id plus hashed IP, not the raw values', async () => {
  const calls = stubLimiter('report-card-revalidate', async () => ({ success: true }));
  await mod.checkPurchaseRateLimit(req(), 'report-card-revalidate', 'purchase_123');

  assert.equal(calls.length, 1);
  const [purchasePart, ipPart] = calls[0].split(':');
  assert.equal(purchasePart, await mod.hashedRateLimitKey('purchase_123'));
  assert.equal(ipPart, await mod.hashedRateLimitKey('203.0.113.7'));
  assert.doesNotMatch(calls[0], /purchase_123|203\.0\.113\.7/);
});

test('checkRestoreConfirmRateLimit still blocks on either tier and still fails open, unchanged', async () => {
  stubLimiter('report-card-restore-confirm', async () => ({ success: false }));
  stubLimiter('report-card-restore-confirm-ip', async () => ({ success: true }));
  assert.equal((await mod.checkRestoreConfirmRateLimit(req(), 'tok')).blocked, true, 'link tier');

  stubLimiter('report-card-restore-confirm', async () => ({ success: true }));
  stubLimiter('report-card-restore-confirm-ip', async () => ({ success: false }));
  assert.equal((await mod.checkRestoreConfirmRateLimit(req(), 'tok')).blocked, true, 'ip tier');

  stubLimiter('report-card-restore-confirm', async () => ({ success: true }));
  stubLimiter('report-card-restore-confirm-ip', async () => ({ success: true }));
  assert.equal((await mod.checkRestoreConfirmRateLimit(req(), 'tok')).blocked, false, 'both clear');

  // Fail-open path. Only the second limiter rejects: with both rejecting, the
  // first promise sits briefly unattended while Promise.all's second argument
  // is still being built, and node:test reports that momentary unhandled
  // rejection as a failure even though the helper does catch it.
  stubLimiter('report-card-restore-confirm', async () => ({ success: true }));
  stubLimiter('report-card-restore-confirm-ip', async () => { throw new Error('down'); });
  console.error = () => {};
  try {
    assert.equal((await mod.checkRestoreConfirmRateLimit(req(), 'tok')).blocked, false, 'fails open');
  } finally {
    console.error = originalError;
  }
});
