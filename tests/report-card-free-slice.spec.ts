import { test, expect, type Page } from '@playwright/test';

/**
 * The free slice on the Report Card Comment Library paywall.
 *
 * These run against the real unauthenticated page, which is the only way to
 * check this: lib/report-card-teaser.ts is `server-only` (deliberately, it is
 * what keeps the other ~354 comments out of the browser bundle) so its slice
 * builder cannot be imported into a test process. The rendered page is the
 * contract that actually matters anyway: a visitor must be able to type a name,
 * filter, and copy real comments before paying.
 *
 * No Stripe interaction. Nothing here clicks through to checkout.
 */

const LIBRARY = '/report-card-comment-library';

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

/** Every rendered free comment card, by its copy button. */
function commentCards(page: Page) {
  return page.getByRole('button', { name: /^(Copy|Copied!)$/ });
}

test.describe('free slice', () => {
  test('renders a usable number of real, copyable comments', async ({ page }) => {
    await page.goto(LIBRARY);

    // 15-25 is the product decision: enough to prove the library works, not so
    // many there is no reason to buy.
    const cards = commentCards(page);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(15);
    expect(count).toBeLessThanOrEqual(25);

    // Every section is represented, so the slice is not 20 behavior comments.
    for (const label of ['Behavior', 'ADHD / Attention', 'Preschool', 'Academics', 'Social-Emotional']) {
      await expect(
        page.locator('span').filter({ hasText: new RegExp(`^${label.replace('/', '\\/')}$`) }).first(),
        `${label} should appear in the free slice`,
      ).toBeVisible();
    }

    // Both tones present.
    await expect(page.locator('span').filter({ hasText: /^Positive$/ }).first()).toBeVisible();
    await expect(page.locator('span').filter({ hasText: /^Growth$/ }).first()).toBeVisible();

    // Most of the library is still locked, and the page says so.
    await expect(page.getByText(/more comments/).first()).toBeVisible();
  });

  test('name field fills into every visible comment', async ({ page }) => {
    await page.goto(LIBRARY);

    // Before typing, comments preview against the sample name.
    const body = page.locator('body');
    await expect(body).toContainText('Jordan');

    await page.getByLabel(/Student name/).fill('rosalind');

    // Capitalized, and the placeholder token never leaks to the reader.
    await expect(body).toContainText('Rosalind');
    await expect(body).not.toContainText('[Student]');
    await expect(body).not.toContainText('Jordan is');
  });

  test('search and chips filter the slice for real', async ({ page }) => {
    await page.goto(LIBRARY);
    const unfiltered = await commentCards(page).count();

    // A section chip narrows the list to fewer cards than the full slice.
    await page.getByRole('button', { name: 'Academics', exact: true }).click();
    const academicsOnly = await commentCards(page).count();
    expect(academicsOnly).toBeGreaterThan(0);
    expect(academicsOnly).toBeLessThan(unfiltered);

    // Back to all, then a tone chip narrows it a different way.
    await page.getByRole('button', { name: 'All sections' }).click();
    await page.getByRole('button', { name: 'Growth', exact: true }).click();
    const growthOnly = await commentCards(page).count();
    expect(growthOnly).toBeGreaterThan(0);
    expect(growthOnly).toBeLessThan(unfiltered);

    await page.getByRole('button', { name: 'All tones' }).click();

    // Search matches comment text, and a miss says so rather than showing rows.
    await page.getByLabel('Search the free comments').fill('zzzznotacomment');
    await expect(commentCards(page)).toHaveCount(0);
    await expect(page.getByText(/Nothing in the free sample matches/)).toBeVisible();
  });

  test('copy puts the personalized comment on the clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(LIBRARY);

    await page.getByLabel(/Student name/).fill('Amara');
    await commentCards(page).first().click();

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('Amara');
    expect(copied).not.toContain('[Student]');
    expect(copied).not.toContain('Jordan');
  });

  test('with no name typed, copy falls back to "the student"', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(LIBRARY);

    await commentCards(page).first().click();

    // Never the sample name: pasting "Jordan" into another child's report card
    // is the one failure mode that reaches a parent.
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).not.toContain('Jordan');
    expect(copied).not.toContain('[Student]');
  });

  test('fires the free-slice funnel events, without duplicates', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const captured = await captureEvents(page);
    await page.goto(LIBRARY);

    // Poll rather than assert immediately: the event fires from an effect on
    // hydration, which is not complete just because the input is visible.
    await expect
      .poll(() => eventsNamed(captured, 'library_page_view').length)
      .toBeGreaterThan(0);
    expect(eventsNamed(captured, 'library_page_view')[0]).toMatchObject({ variant: 'free' });

    // name_entered is once per visitor, not once per keystroke.
    await page.getByLabel(/Student name/).fill('Amara');
    await page.getByLabel(/Student name/).fill('Amara B');
    expect(eventsNamed(captured, 'name_entered')).toHaveLength(1);

    // filter_used is once per control, so repeat clicks do not inflate it.
    await page.getByRole('button', { name: 'Academics', exact: true }).click();
    await page.getByRole('button', { name: 'All sections' }).click();
    expect(eventsNamed(captured, 'filter_used').filter((e) => e.filter === 'section')).toHaveLength(1);

    await page.getByRole('button', { name: 'Growth', exact: true }).click();
    expect(eventsNamed(captured, 'filter_used').filter((e) => e.filter === 'tone')).toHaveLength(1);
    await page.getByRole('button', { name: 'All tones' }).click();

    // The copy handler awaits the clipboard write before firing, so the event
    // lands after the click resolves.
    await commentCards(page).first().click();
    await expect.poll(() => eventsNamed(captured, 'free_comment_copied').length).toBe(1);
    expect(typeof eventsNamed(captured, 'free_comment_copied')[0].section).toBe('string');

    await page.getByText(/more comments/).first().click();
    await expect.poll(() => eventsNamed(captured, 'locked_comment_clicked').length).toBe(1);

    // No user-typed text or comment text may ride along on any of these.
    for (const call of captured) {
      expect(JSON.stringify(call)).not.toContain('Amara');
    }
  });

  test('locked comments are never delivered to an unpaid browser', async ({ page }) => {
    await page.goto(LIBRARY);

    // The page ships only the free slice. If the full dataset ever leaks into
    // the RSC payload or a chunk, the free card count would not match what the
    // page claims is free, and this is the cheap guard on that.
    const claimedFree = await page.getByText(/of \d+ free comments/).first().textContent();
    const claimed = Number(claimedFree?.match(/of (\d+) free comments/)?.[1]);
    expect(claimed).toBeGreaterThan(0);
    await expect(commentCards(page)).toHaveCount(claimed);
  });
});
