import { test, expect } from '@playwright/test';

for (const width of [360, 768, 1024, 1440]) {
  test(`homepage grid and navigation work at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.hero-ctas')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
    const grid = page.locator('.hero-quick-grid');
    await grid.getByRole('button', { name: 'Log a note for Comet', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'On Task', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true }).click();
    await expect(grid.getByRole('button', { name: 'Log a note for Comet, note logged', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width <= 900) {
      const gridBox = (await grid.boundingBox())!;
      const badges = (await page.locator('.hero-install-options').boundingBox())!;
      expect(badges.y).toBeGreaterThanOrEqual(gridBox.y + gridBox.height);
    }
    await page.locator('.plans-section').scrollIntoViewIfNeeded();
    await expect(page.locator('.home-nav')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.plans-section').getByRole('link', { name: 'Try the free demo' })).toHaveAttribute('href', /demo=true/);
    await expect(page.locator('#walkthrough')).not.toHaveAttribute('open');
  });
}

test('tools groups prompts separately and offers the demo', async ({ page }) => {
  await page.goto('/tools');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Prompts to use with ChatGPT' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try the Free Demo' })).toHaveAttribute('href', /demo=true/);
});
