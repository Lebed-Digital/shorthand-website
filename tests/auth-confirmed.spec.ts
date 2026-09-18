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
