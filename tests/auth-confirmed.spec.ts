import { expect, test } from '@playwright/test';

const fragment = '#access_token=access-secret&refresh_token=refresh-secret&expires_at=2000000000&expires_in=3600&token_type=bearer&type=signup';

test('scrubs a valid signup fragment and adds it only when the link is tapped', async ({ page }) => {
  await page.goto(`/auth/confirmed${fragment}`);
  await expect(page.getByRole('heading', { name: 'Email verified' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('');
  await expect(page.getByRole('link', { name: 'Open ShortHand' })).toHaveAttribute('href', 'https://app.getshorthandapp.com/auth/confirmed');
  await expect(page.locator('body')).not.toContainText('access-secret');
  await expect(page.locator('body')).not.toContainText('refresh-secret');
  await page.getByRole('link', { name: 'Open ShortHand' }).evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once: true });
  });
  await page.getByRole('link', { name: 'Open ShortHand' }).click();
  await expect(page.getByRole('link', { name: 'Open ShortHand' })).toHaveAttribute('href', `https://app.getshorthandapp.com/auth/confirmed${fragment}`);
});

for (const [name, fragment] of [
  ['missing', ''],
  ['malformed', '#access_token=only'],
  ['Supabase error', '#error=access_denied&error_code=otp_expired&error_description=Expired'],
] as const) {
  test(`${name} fragment shows failure without an Open ShortHand link`, async ({ page }) => {
    await page.goto(`/auth/confirmed${fragment}`);
    await expect(page.getByRole('heading', { name: 'Confirmation link unavailable' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open ShortHand' })).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => location.hash)).toBe('');
  });
}

// --- TEMPORARY DIAGNOSTICS TESTS (remove with the diagnostics) ---

const ACCESS = 'eyJhbGciOiJIUzI1NiJ9.SUPERSECRETACCESSVALUE.sig';
const REFRESH = 'v1MrSUPERSECRETREFRESHVALUE';

test('a successful callback shows the clean UI with no diagnostics', async ({ page }) => {
  await page.goto(`/auth/confirmed${fragment}`);
  await expect(page.getByRole('heading', { name: 'Email verified' })).toBeVisible();
  await expect(page.getByTestId('diagnostics')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open ShortHand' })).toHaveAttribute('href', 'https://app.getshorthandapp.com/auth/confirmed');
  await expect(page.locator('body')).not.toContainText('Diagnostics');
});

test('an invalid callback shows safe diagnostics automatically, with no debug flag', async ({ page }) => {
  const reqs: string[] = [];
  const logs: string[] = [];
  page.on('request', r => reqs.push(r.url()));
  page.on('console', m => logs.push(m.text()));

  // Real-world-shaped failure: supabase type=email plus an extra provider key.
  await page.goto(`/auth/confirmed#access_token=${ACCESS}&refresh_token=${REFRESH}&provider_token=PROVIDERSECRET&expires_at=2000000000&expires_in=3600&token_type=bearer&type=email`);
  await expect(page.getByRole('heading', { name: 'Confirmation link unavailable' })).toBeVisible();

  const panel = page.getByTestId('diagnostics');
  await expect(panel).toBeVisible();
  const text = await panel.innerText();
  expect(text).toContain('wrong_type');
  expect(text).toContain('unexpected_key:provider_token');
  expect(text).toContain('access_token present: true');
  expect(text).toContain('type: email');

  // No secret anywhere: panel, body, HTML, requests, or console.
  const body = await page.locator('body').innerText();
  const html = await page.content();
  for (const secret of [ACCESS, REFRESH, 'SUPERSECRETACCESSVALUE', 'SUPERSECRETREFRESHVALUE', 'PROVIDERSECRET']) {
    expect(text).not.toContain(secret);
    expect(body).not.toContain(secret);
    expect(html).not.toContain(secret);
    expect(reqs.some(u => u.includes(secret))).toBe(false);
    expect(logs.some(l => l.includes(secret))).toBe(false);
  }

  // Protections intact.
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('');
  expect(reqs.filter(u => !u.includes('localhost'))).toEqual([]);
  expect(await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage) + document.cookie)).toBe('{}{}');
});

test('a Supabase error fragment shows a safe error code and no description', async ({ page }) => {
  await page.goto('/auth/confirmed#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired');
  await expect(page.getByRole('heading', { name: 'Confirmation link unavailable' })).toBeVisible();
  const panel = page.getByTestId('diagnostics');
  await expect(panel).toContainText('supabase_error:otp_expired');
  await expect(panel).not.toContainText('Email link is invalid');
  await expect(page.getByRole('link', { name: 'Open ShortHand' })).toHaveCount(0);
});

test('a missing fragment reports missing_fragment', async ({ page }) => {
  await page.goto('/auth/confirmed');
  await expect(page.getByTestId('diagnostics')).toContainText('missing_fragment');
});
