import { test, expect, type Page } from '@playwright/test';

/**
 * Generation analytics contracts for the two free AI generators (audit F4).
 *
 * No real OpenAI calls and no real rate limiting: every test stubs the API
 * route and asserts what the browser reports for that answer. The point is the
 * mapping from HTTP status to event, and the guarantee that nothing a teacher
 * typed ever reaches analytics.
 */

type GtagCall = [string, string, Record<string, unknown>];

/** Captures gtag calls the same way tests/report-card-payment-path.spec.ts does. */
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

async function stubRoute(page: Page, url: string, status: number, body: unknown) {
  await page.route(url, async (route) => {
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

// --- Welcome Letter ---------------------------------------------------------

const TOOLKIT = '/back-to-school-toolkit';

async function fillLetterForm(page: Page, name = 'Ms. Johnson') {
  await page.getByPlaceholder('e.g. Ms. Johnson').fill(name);
  await page.getByRole('combobox').first().selectOption('3rd Grade');
}

test('a successful letter fires attempt then success, and no failure or block', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/welcome-letter', 200, { letter: 'Dear families, welcome to third grade.' });

  await page.goto(TOOLKIT);
  await fillLetterForm(page);
  await page.getByRole('button', { name: /Generate letter/i }).click();

  await expect.poll(() => eventsNamed(events, 'generation_success').length).toBe(1);
  expect(eventsNamed(events, 'generation_attempt')).toEqual([
    { tool: 'welcome-letter', action: 'generate' },
  ]);
  expect(eventsNamed(events, 'generation_success')).toEqual([
    { tool: 'welcome-letter', action: 'generate' },
  ]);
  expect(eventsNamed(events, 'generation_failed')).toHaveLength(0);
  expect(eventsNamed(events, 'generation_blocked')).toHaveLength(0);
});

test('a 429 fires generation_blocked and never generation_success', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/welcome-letter', 429, {
    error: { message: "You've reached the free generation limit. Try again in about an hour." },
  });

  await page.goto(TOOLKIT);
  await fillLetterForm(page);
  await page.getByRole('button', { name: /Generate letter/i }).click();

  await expect.poll(() => eventsNamed(events, 'generation_blocked').length).toBe(1);
  expect(eventsNamed(events, 'generation_blocked')).toEqual([
    { tool: 'welcome-letter', action: 'generate' },
  ]);
  expect(eventsNamed(events, 'generation_success')).toHaveLength(0);
  expect(eventsNamed(events, 'generation_failed')).toHaveLength(0);
  // The teacher still sees the same message as before this change.
  await expect(page.getByText(/reached the free generation limit/i)).toBeVisible();
});

test('a 500 fires generation_failed with a coarse reason, not the upstream message', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/welcome-letter', 500, {
    error: { message: 'Rate limit reached for gpt-5.6-luna in organization org-SECRET123' },
  });

  await page.goto(TOOLKIT);
  await fillLetterForm(page);
  await page.getByRole('button', { name: /Generate letter/i }).click();

  await expect.poll(() => eventsNamed(events, 'generation_failed').length).toBe(1);
  expect(eventsNamed(events, 'generation_failed')).toEqual([
    { tool: 'welcome-letter', action: 'generate', reason: 'http_error' },
  ]);
  expect(eventsNamed(events, 'generation_success')).toHaveLength(0);
  // The upstream string must not appear anywhere in analytics.
  expect(JSON.stringify(events)).not.toContain('org-SECRET123');
  expect(JSON.stringify(events)).not.toContain('gpt-5.6-luna');
});

test('refine reports under the refine action, in its own attempt/success pair', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/welcome-letter', 200, { letter: 'First draft of the letter.' });
  await stubRoute(page, '**/api/welcome-letter-refine', 200, { letter: 'Refined draft of the letter.' });

  await page.goto(TOOLKIT);
  await fillLetterForm(page);
  await page.getByRole('button', { name: /Generate letter/i }).click();
  await expect.poll(() => eventsNamed(events, 'generation_success').length).toBe(1);

  await page.getByRole('button', { name: 'Refine', exact: true }).click();
  await expect.poll(() => eventsNamed(events, 'generation_success').length).toBe(2);

  expect(eventsNamed(events, 'generation_attempt')).toEqual([
    { tool: 'welcome-letter', action: 'generate' },
    { tool: 'welcome-letter', action: 'refine' },
  ]);
  expect(eventsNamed(events, 'generation_success')).toEqual([
    { tool: 'welcome-letter', action: 'generate' },
    { tool: 'welcome-letter', action: 'refine' },
  ]);
});

test('nothing a teacher typed reaches analytics', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/welcome-letter', 200, { letter: 'Dear families, welcome to third grade.' });

  await page.goto(TOOLKIT);
  await fillLetterForm(page, 'Mrs. Zelenskaya');
  await page.getByRole('button', { name: /Generate letter/i }).click();

  await expect.poll(() => eventsNamed(events, 'generation_success').length).toBe(1);
  const serialized = JSON.stringify(events);
  expect(serialized).not.toContain('Zelenskaya');
  expect(serialized).not.toContain('Dear families');
  expect(serialized).not.toContain('3rd Grade');
});

test('a validation failure sends no request and reports no attempt', async ({ page }) => {
  const events = await captureEvents(page);
  let requests = 0;
  await page.route('**/api/welcome-letter', async (route) => {
    requests += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"letter":"x"}' });
  });

  await page.goto(TOOLKIT);
  // No name, no grade: the client rejects this before fetching.
  await page.getByRole('button', { name: /Generate letter/i }).click();
  await expect(page.getByText(/Please enter your name/i)).toBeVisible();

  expect(requests).toBe(0);
  expect(eventsNamed(events, 'generation_attempt')).toHaveLength(0);
});

// --- Report Card Comment Generator ------------------------------------------

const COMMENT_TOOL = '/report-card-comment-generator';

async function generateComment(page: Page) {
  // Select any one chip, then generate.
  await page.getByRole('button', { name: 'Reading', exact: true }).first().click();
  await page.getByRole('button', { name: /Generate comment/i }).click();
}

test('comment generator reports success under its own tool key', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/free-tool', 200, { comment: 'A warm, specific comment.' });

  await page.goto(COMMENT_TOOL);
  await generateComment(page);

  await expect.poll(() => eventsNamed(events, 'generation_success').length).toBe(1);
  expect(eventsNamed(events, 'generation_attempt')).toEqual([
    { tool: 'report-card-comment', action: 'generate' },
  ]);
  expect(eventsNamed(events, 'generation_success')).toEqual([
    { tool: 'report-card-comment', action: 'generate' },
  ]);
});

test('comment generator reports a 429 as blocked, not failed', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/free-tool', 429, {
    error: { message: "You've reached the free generation limit. Try again in about an hour." },
  });

  await page.goto(COMMENT_TOOL);
  await generateComment(page);

  await expect.poll(() => eventsNamed(events, 'generation_blocked').length).toBe(1);
  expect(eventsNamed(events, 'generation_blocked')).toEqual([
    { tool: 'report-card-comment', action: 'generate' },
  ]);
  expect(eventsNamed(events, 'generation_failed')).toHaveLength(0);
  expect(eventsNamed(events, 'generation_success')).toHaveLength(0);
});

test('every attempt resolves to exactly one outcome', async ({ page }) => {
  const events = await captureEvents(page);
  await stubRoute(page, '**/api/free-tool', 200, { comment: 'A warm, specific comment.' });

  await page.goto(COMMENT_TOOL);
  await generateComment(page);
  await expect.poll(() => eventsNamed(events, 'generation_success').length).toBe(1);

  const attempts = eventsNamed(events, 'generation_attempt').length;
  const outcomes =
    eventsNamed(events, 'generation_success').length +
    eventsNamed(events, 'generation_blocked').length +
    eventsNamed(events, 'generation_failed').length;
  expect(outcomes).toBe(attempts);
});
