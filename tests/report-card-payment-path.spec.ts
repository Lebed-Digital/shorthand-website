import { test, expect, type Page } from '@playwright/test';

/**
 * Payment-path contracts for the Report Card Comment Library.
 *
 * NO REAL STRIPE CHARGES. Every test here intercepts the two server routes
 * that would talk to Stripe (`create-session`, `verify-session`) and serves a
 * fixture. Nothing navigates to Stripe's hosted checkout, so none of these
 * tests depend on Stripe's UI, which would be brittle and slow.
 *
 * What that means for coverage, stated plainly: these are WEBSITE-SIDE
 * contracts. The Supabase Edge Functions (fulfillment idempotency, the
 * webhook/success-page race, HMAC signing, the purchase-row upsert) run under
 * Deno against live Stripe and Supabase and cannot be exercised from this
 * harness. What IS tested here is that the browser treats the server's answer
 * correctly: in particular that a `granted:true` response is the ONLY thing
 * that produces a purchase event, and that a Stripe redirect on its own is not.
 * See the audit doc for the untestable-from-here list.
 */

const LIBRARY = '/report-card-comment-library';
const SUCCESS = '/report-card-comment-library/success';

type GtagCall = [string, string, Record<string, unknown>];

/** Captures gtag calls the same way tests/resource-offer.spec.ts does. */
async function captureEvents(page: Page): Promise<GtagCall[]> {
  const captured: GtagCall[] = [];
  await page.exposeFunction('__recordEvent', (args: GtagCall) => {
    captured.push(args);
  });
  await page.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag = (...args: unknown[]) => (window as any).__recordEvent(args);
  });
  return captured;
}

function eventsNamed(captured: GtagCall[], name: string): Record<string, unknown>[] {
  return captured.filter((c) => c[0] === 'event' && c[1] === name).map((c) => c[2]);
}

/**
 * Stubs create-session so the browser never leaves for Stripe. Returns the
 * request payloads observed, so a test can assert the CTA actually called it.
 */
async function stubCreateSession(
  page: Page,
  respond: { status?: number; body?: unknown } = {}
): Promise<{ calls: number }> {
  const state = { calls: 0 };
  await page.route('**/api/report-card-checkout/create-session', async (route) => {
    state.calls += 1;
    await route.fulfill({
      status: respond.status ?? 200,
      contentType: 'application/json',
      // A relative URL keeps the browser on localhost instead of navigating to
      // Stripe. The redirect target itself is not what these tests are about.
      body: JSON.stringify(respond.body ?? { url: `${LIBRARY}?stubbed-checkout=1` }),
    });
  });
  return state;
}

async function stubVerifySession(
  page: Page,
  respond: { status?: number; body: unknown }
): Promise<{ calls: number }> {
  const state = { calls: 0 };
  await page.route('**/api/report-card-checkout/verify-session', async (route) => {
    state.calls += 1;
    await route.fulfill({
      status: respond.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(respond.body),
    });
  });
  return state;
}

// ---------------------------------------------------------------------------
// Checkout initiation
// ---------------------------------------------------------------------------

test('purchase CTA calls create-session and fires begin_checkout with product context', async ({
  page,
}) => {
  const captured = await captureEvents(page);
  const createSession = await stubCreateSession(page);

  await page.goto(LIBRARY);
  await page.getByRole('button', { name: /get the full library/i }).click();

  await expect.poll(() => createSession.calls).toBe(1);

  await expect.poll(() => eventsNamed(captured, 'begin_checkout').length).toBe(1);
  const events = eventsNamed(captured, 'begin_checkout');
  expect(events[0].product_key).toBe('report-card-comment-library');
  expect(events[0].value).toBe(4.99);
  expect(events[0].currency).toBe('USD');
  expect(events[0].cta_source).toBe('paywall-hero');
});

test('the bottom CTA reports a distinct source so the two buttons can be compared', async ({
  page,
}) => {
  const captured = await captureEvents(page);
  await stubCreateSession(page);

  await page.goto(LIBRARY);
  await page.getByRole('button', { name: /get all .* comments for \$4\.99/i }).click();

  await expect.poll(() => eventsNamed(captured, 'begin_checkout').length).toBe(1);
  expect(eventsNamed(captured, 'begin_checkout')[0].cta_source).toBe('paywall-bottom');
});

test('a failed create-session reports checkout_start_failed and never a purchase', async ({
  page,
}) => {
  const captured = await captureEvents(page);
  await stubCreateSession(page, {
    status: 500,
    body: { error: { message: 'Could not start checkout. Please try again.' } },
  });

  await page.goto(LIBRARY);
  await page.getByRole('button', { name: /get the full library/i }).click();

  // Scoped to <p role="alert">: Next.js renders its own route-announcer with
  // role=alert, so an unscoped getByRole('alert') is ambiguous.
  await expect(page.locator('p[role="alert"]')).toContainText(/could not start checkout/i);

  await expect.poll(() => eventsNamed(captured, 'checkout_start_failed').length).toBe(1);
  expect(eventsNamed(captured, 'begin_checkout')).toHaveLength(1);
  // The single most important negative assertion on this path.
  expect(eventsNamed(captured, 'purchase')).toHaveLength(0);
});

test('a rate-limited checkout is reported as rate_limited, not as a purchase', async ({ page }) => {
  const captured = await captureEvents(page);
  await stubCreateSession(page, { status: 429, body: { error: { message: 'Too many requests.' } } });

  await page.goto(LIBRARY);
  await page.getByRole('button', { name: /get the full library/i }).click();

  await expect.poll(() => eventsNamed(captured, 'checkout_start_failed').length).toBe(1);
  const failures = eventsNamed(captured, 'checkout_start_failed');
  expect(failures[0].reason).toBe('rate_limited');
  expect(eventsNamed(captured, 'purchase')).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Success page: purchase fires only on confirmed fulfillment
// ---------------------------------------------------------------------------

test('confirmed fulfillment fires exactly one purchase event with value and currency', async ({
  page,
}) => {
  const captured = await captureEvents(page);
  await stubVerifySession(page, { body: { granted: true } });

  await page.goto(`${SUCCESS}?session_id=cs_test_stubbed_123`);
  await expect.poll(() => eventsNamed(captured, 'purchase').length).toBe(1);

  const purchase = eventsNamed(captured, 'purchase')[0];
  expect(purchase.product_key).toBe('report-card-comment-library');
  expect(purchase.value).toBe(4.99);
  expect(purchase.currency).toBe('USD');
  // No payment identifiers may reach GA4.
  expect(Object.keys(purchase)).not.toContain('transaction_id');
  expect(JSON.stringify(purchase)).not.toContain('cs_test');
});

test('a Stripe redirect whose fulfillment is NOT granted never fires purchase', async ({ page }) => {
  const captured = await captureEvents(page);
  // The exact scenario the brief warns about: the browser is sitting on the
  // success URL, but the server has not confirmed payment.
  await stubVerifySession(page, { body: { granted: false, reason: 'not_paid' } });

  await page.goto(`${SUCCESS}?session_id=cs_test_unpaid`);
  await expect(page.getByRole('heading', { name: /could not confirm/i })).toBeVisible();

  expect(eventsNamed(captured, 'purchase')).toHaveLength(0);
});

test('a transient verify failure retries and still fires no purchase', async ({ page }) => {
  const captured = await captureEvents(page);
  const verify = await stubVerifySession(page, {
    status: 503,
    body: { granted: false, reason: 'temporarily_unavailable' },
  });

  await page.goto(`${SUCCESS}?session_id=cs_test_transient`);

  // Retries are what protect a real buyer from the webhook race; they must
  // keep happening, and must not manufacture a purchase event.
  await expect.poll(() => verify.calls, { timeout: 15_000 }).toBeGreaterThan(1);
  expect(eventsNamed(captured, 'purchase')).toHaveLength(0);
});

test('a missing session_id fires no purchase', async ({ page }) => {
  const captured = await captureEvents(page);
  await page.goto(SUCCESS);
  await expect(page.getByRole('heading', { name: /could not confirm/i })).toBeVisible();
  expect(eventsNamed(captured, 'purchase')).toHaveLength(0);
});

test('re-verifying the same session does not double-count the purchase', async ({ page }) => {
  const captured = await captureEvents(page);
  const verify = await stubVerifySession(page, { body: { granted: true } });

  await page.goto(`${SUCCESS}?session_id=cs_test_repeat`);
  await expect.poll(() => eventsNamed(captured, 'purchase').length).toBe(1);

  // Return to the same success URL, as a refresh or a back-navigation would.
  // Server-side fulfillment is idempotent and must stay callable; what must
  // NOT happen is a second purchase event.
  await page.goto(`${SUCCESS}?session_id=cs_test_repeat`);
  await page.waitForTimeout(1500);

  expect(verify.calls).toBeGreaterThan(1);
  expect(eventsNamed(captured, 'purchase')).toHaveLength(1);
});

// ---------------------------------------------------------------------------
// Access gating
// ---------------------------------------------------------------------------

test('without an access cookie the paywall is shown and no full library leaks', async ({
  page,
}) => {
  await page.goto(LIBRARY);

  await expect(page.getByRole('button', { name: /get the full library/i })).toBeVisible();

  // The teaser ships two samples per section. If a regression ever renders the
  // full library on the unauthenticated branch, the page's own text would carry
  // far more than the teaser count; this is a cheap canary for that.
  const body = (await page.textContent('body')) ?? '';
  expect(body).toContain('$4.99');
  expect(body).not.toContain('Search comments');
});

test('a forged access cookie does not unlock the library', async ({ page, context }) => {
  // The gate verifies an HMAC over the payload, so a hand-made cookie must be
  // rejected locally, with no network call and regardless of Supabase state.
  await context.addCookies([
    {
      name: 'rccl_access',
      value: 'eyJwdXJjaGFzZUlkIjoiZmFrZSIsImV4cCI6OTk5OTk5OTk5OSwicmV2YWxpZGF0ZUFmdGVyIjo5OTk5OTk5OTk5fQ.forged',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.goto(LIBRARY);
  await expect(page.getByRole('button', { name: /get the full library/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Restore flow
// ---------------------------------------------------------------------------

test('submitting the restore form fires restore_purchase_attempt', async ({ page }) => {
  const captured = await captureEvents(page);
  await page.route('**/api/report-card-access/restore', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  );

  await page.goto(`${LIBRARY}/restore`);
  await page.locator('#restore-email').fill('teacher@school.edu');
  await page.getByRole('button', { name: /email me a link/i }).click();

  await expect(page.getByRole('heading', { name: /check your inbox/i })).toBeVisible();

  await expect.poll(() => eventsNamed(captured, 'restore_purchase_attempt').length).toBe(1);
  const events = eventsNamed(captured, 'restore_purchase_attempt');
  // Anti-enumeration and PII: the address must never appear in analytics.
  expect(JSON.stringify(events[0])).not.toContain('teacher@school.edu');
});

test('an invalid email is not counted as a restore attempt', async ({ page }) => {
  const captured = await captureEvents(page);

  await page.goto(`${LIBRARY}/restore`);
  await page.locator('#restore-email').fill('not-an-email');
  await page.getByRole('button', { name: /email me a link/i }).click();

  await expect(page.locator('#restore-email-error')).toContainText(/valid email/i);
  expect(eventsNamed(captured, 'restore_purchase_attempt')).toHaveLength(0);
});

test('the restore form shows an identical result for any well-formed address', async ({ page }) => {
  // Anti-enumeration guard: a server error must look exactly like a success.
  await page.route('**/api/report-card-access/restore', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );

  await page.goto(`${LIBRARY}/restore`);
  await page.locator('#restore-email').fill('stranger@example.com');
  await page.getByRole('button', { name: /email me a link/i }).click();

  await expect(page.getByRole('heading', { name: /check your inbox/i })).toBeVisible();
});

test('the restore failure page reports the coarse reason only', async ({ page }) => {
  for (const [param, expected] of [
    ['busy', 'busy'],
    ['link', 'link'],
  ] as const) {
    const captured = await captureEvents(page);
    await page.goto(`${LIBRARY}/restore/failed?e=${param}`);

    await expect.poll(() => eventsNamed(captured, 'restore_purchase_failure').length).toBe(1);
    const event = eventsNamed(captured, 'restore_purchase_failure')[0];
    expect(event.reason).toBe(expected);
    // Internal server reasons must never be forwarded to analytics.
    const serialized = JSON.stringify(event);
    for (const leak of ['not_paid', 'lookup_failed', 'invalid_or_expired_token']) {
      expect(serialized).not.toContain(leak);
    }
    await page.close();
    page = await page.context().newPage();
  }
});

test('?restored=1 does not fire restore_purchase_success without real access', async ({ page }) => {
  // The marker is an analytics flag, not an entitlement. Arriving with it while
  // unauthenticated must show the paywall and report nothing.
  const captured = await captureEvents(page);
  await page.goto(`${LIBRARY}?restored=1`);

  await expect(page.getByRole('button', { name: /get the full library/i })).toBeVisible();
  expect(eventsNamed(captured, 'restore_purchase_success')).toHaveLength(0);
});
