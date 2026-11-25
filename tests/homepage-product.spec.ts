import { test, expect } from '@playwright/test';

for (const width of [360, 768, 1024, 1440]) {
  test(`homepage grid and navigation work at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Never walk into a parent meeting');
    await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
    await page.getByRole('button', { name: 'Log a note for Comet', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'On Task', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Log a note for Comet, note logged', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('heading', { name: /What teachers ask/ }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeInViewport();
    await expect(page.getByRole('link', { name: /Try the free demo/ }).first()).toHaveAttribute('href', /demo=true/);
    await expect(page.locator('details a', { hasText: 'ShortHand for Schools' })).toHaveAttribute('href', '/for-schools');
  });
}

test('tools groups prompts separately and offers the demo', async ({ page }) => {
  await page.goto('/tools');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Prompts to use with ChatGPT' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try the Free Demo' })).toHaveAttribute('href', /demo=true/);
});
