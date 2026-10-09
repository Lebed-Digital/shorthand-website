import { test, expect, type Page } from '@playwright/test';

/**
 * The Report Card Comment Library offer on blog posts.
 *
 * What these hold in place:
 *   1. A comment-list post carries three library links (a note under the
 *      subtitle, the mid-post comparison, a block at the end), and each one
 *      reports its own cta_destination, so the placements can be compared in
 *      GA4 instead of collapsing into one total.
 *   2. The free page and the paid library are told apart in plain words, with
 *      the price, and the button offers the free sample.
 *   3. A post that is not a comment list, or that already closes on the
 *      library in its own words, does not get the extra blocks.
 */

const LIBRARY = '/report-card-comment-library';

type GtagCall = [string, string, Record<string, unknown>];

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

function ctaClicks(captured: GtagCall[]): Record<string, unknown>[] {
  return captured.filter((c) => c[0] === 'event' && c[1] === 'cta_click').map((c) => c[2]);
}

const libraryLinks = (page: Page) => page.locator(`article a[href="${LIBRARY}"]`);

test('a comment-list post says what is free and what is $4.99', async ({ page }) => {
  await page.goto('/blog/report-card-comments-for-behavior');
  const article = page.locator('article');

  await expect(article.getByText('Writing these for a whole class?')).toBeVisible();
  await expect(article.getByText('This page Free')).toBeVisible();
  await expect(article.getByText('The library $4.99 once')).toBeVisible();
  await expect(article.getByText('Still have most of your class to write?')).toBeVisible();
  // Note, comparison (link + button), end block (link + button).
  await expect(libraryLinks(page)).toHaveCount(5);
  // The numbers come from the library itself, never from typed copy.
  await expect(article.getByRole('link', { name: /^Try \d+ comments free$/ })).toHaveCount(2);
  await expect(article.getByText('LIBRARYCTAMARKER')).toHaveCount(0);
});

for (const [index, destination] of [
  'report-card-library-top',
  'report-card-library-inline',
  'report-card-library-inline-button',
  'report-card-library-end',
  'report-card-library-end-button',
].entries()) {
  test(`library link ${index + 1} reports "${destination}" and opens the library`, async ({ page }) => {
    const captured = await captureEvents(page);
    await page.goto('/blog/report-card-comments-for-behavior');

    await libraryLinks(page).nth(index).click();
    await page.waitForURL(`**${LIBRARY}`);

    expect(ctaClicks(captured)).toEqual([
      expect.objectContaining({
        cta_source: 'report-card-comments-for-behavior',
        cta_destination: destination,
      }),
    ]);
  });
}

test('the nav button on a comment post reports its own destination', async ({ page }) => {
  const captured = await captureEvents(page);
  await page.goto('/blog/preschool-report-card-comments');

  await page.locator(`nav a[href="${LIBRARY}"]`).first().click();
  await page.waitForURL(`**${LIBRARY}`);

  expect(ctaClicks(captured)).toEqual([
    expect.objectContaining({
      cta_source: 'preschool-report-card-comments',
      cta_destination: 'report-card-library-nav',
    }),
  ]);
});

test('a post that already closes on the library gets no end block', async ({ page }) => {
  await page.goto('/blog/social-emotional-report-card-comments');
  const article = page.locator('article');

  await expect(article.getByText('Writing these for a whole class?')).toBeVisible();
  await expect(article.getByText('The library $4.99 once')).toBeVisible();
  await expect(article.getByText('Still have most of your class to write?')).toHaveCount(0);
});

for (const slug of ['free-report-card-comment-generator', 'report-card-comments-guide']) {
  test(`${slug}: one short block, no comparison`, async ({ page }) => {
    await page.goto(`/blog/${slug}`);
    const article = page.locator('article');

    await expect(article.getByRole('link', { name: /^Try \d+ comments free$/ })).toHaveCount(1);
    await expect(article.getByText('This page Free')).toHaveCount(0);
    await expect(article.getByText('Writing these for a whole class?')).toHaveCount(0);
    await expect(article.getByText('LIBRARYCTAMARKER')).toHaveCount(0);
  });
}

test('the social shortlinks land on the library and the guide with their UTMs', async ({ page }) => {
  await page.goto('/comments');
  await expect(page).toHaveURL(/\/report-card-comment-library\?utm_source=social&utm_medium=organic_social&utm_campaign=report_card_library$/);
  await expect(page.getByRole('heading', { name: 'Report Card Comment Library' })).toBeVisible();

  await page.goto('/reportcards');
  await expect(page).toHaveURL(/\/blog\/report-card-comments-guide\?utm_source=social&utm_medium=organic_social&utm_campaign=report_card_comments$/);
});
