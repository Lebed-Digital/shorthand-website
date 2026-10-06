import { test, expect, type Page } from '@playwright/test';

/**
 * Experiment `blog-cta-presentation` (lib/posthog-events.ts,
 * components/BlogCtaExperiment.tsx, app/globals.css).
 *
 * The contract:
 *   1. Both variants are the same words, link and position. Only the look changes.
 *   2. No PostHog, a late flag or an unlisted value all leave the control, with
 *      nothing recorded.
 *   3. A visitor is counted as having seen it when it scrolls into view, never
 *      on page load.
 *   4. blog_cta_paused fires once, after two seconds on screen with the tab in
 *      front, and carries no text.
 *
 * PostHog does not run on localhost, so these tests stand in for the three
 * functions instrumentation-client.ts provides and record what they are handed.
 * The real SDK, the real flag request and the real click event are exercised
 * by tests/manual/posthog-privacy-check.mjs.
 */

type Tracked = [string, Record<string, unknown>];

const POST = '/blog/sample-emails-to-parents-about-student-behavior';
const OTHER_BRIDGE_POST = '/blog/how-to-write-a-student-behavior-report';
const KEY = 'blog-cta-presentation';
const CTA = '.blog-workflow-bridge';
const EDITORIAL = /blog-workflow-bridge--editorial/;
const PAUSE = ['blog_cta_paused', { cta_type: 'workflow_bridge', variant: 'test' }];
// Comfortably past the two seconds a pause takes.
const LONGER_THAN_A_PAUSE = 2700;

/** `flag` is what PostHog would answer, and how long it takes. Omit it for a browser where PostHog is not running. */
async function standIn(page: Page, flag?: { value: unknown; afterMs?: number }) {
  const tracked: Tracked[] = [];
  const asked: string[] = [];
  const seen: string[] = [];
  await page.exposeFunction('__recordTracked', (name: string, props: Record<string, unknown>) => void tracked.push([name, props]));
  await page.exposeFunction('__recordAsked', (key: string) => void asked.push(key));
  await page.exposeFunction('__recordSeen', (key: string) => void seen.push(key));
  await page.addInitScript((answer) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (!answer) return;
    w.__shTrack = (name: string, props: unknown) => w.__recordTracked(name, props);
    w.__shFlag = (key: string, onValue: (value: unknown) => void) => {
      w.__recordAsked(key);
      setTimeout(() => onValue(answer.value), answer.afterMs ?? 0);
    };
    w.__shFlagSeen = (key: string) => w.__recordSeen(key);
  }, flag ?? null);
  return { tracked, asked, seen };
}

const cta = (page: Page) => page.locator(CTA);
const show = (page: Page) => cta(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
const leave = (page: Page) => page.evaluate(() => window.scrollTo(0, 0));
const css = (page: Page, selector: string, property: string) =>
  page.locator(selector).first().evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property);
const stepBoxes = (page: Page) =>
  page.locator(`${CTA} li`).evaluateAll((items) =>
    items.map((li) => {
      const number = li.querySelector('span')!.getBoundingClientRect();
      const box = li.getBoundingClientRect();
      return { x: Math.round(box.x), y: Math.round(box.y), numberRight: number.right, numberBottom: number.bottom, right: box.right, bottom: box.bottom };
    }),
  );

test('without PostHog the control stays and nothing is asked or recorded', async ({ page }) => {
  const { tracked, asked, seen } = await standIn(page);
  await page.goto(POST);
  await show(page);
  await page.waitForTimeout(LONGER_THAN_A_PAUSE);

  await expect(cta(page)).not.toHaveClass(EDITORIAL);
  await expect(page.locator('[data-cta-preview]')).toHaveCount(0);
  expect([tracked, asked, seen]).toEqual([[], [], []]);
});

test('the variant has the same words, link and position as the control', async ({ page, context }) => {
  await standIn(page, { value: 'control' });
  await page.goto(POST);
  await expect(cta(page)).not.toHaveClass(EDITORIAL);

  const variantPage = await context.newPage();
  await standIn(variantPage, { value: 'test' });
  await variantPage.goto(POST);
  await expect(cta(variantPage)).toHaveClass(EDITORIAL);

  const describe = (p: Page) =>
    cta(p).evaluate((el) => ({
      // textContent, not innerText: the label is upper-cased by CSS in both.
      words: [...el.querySelectorAll('p, li, a')].map((node) => node.textContent),
      link: el.querySelector('a')!.getAttribute('href'),
      // The post's text sits in one block before the call to action and one after.
      before: el.previousElementSibling?.lastElementChild?.textContent?.slice(0, 13),
      after: el.nextElementSibling?.firstElementChild?.tagName,
      html: el.innerHTML,
    }));
  const control = await describe(page);
  expect(await describe(variantPage)).toEqual(control);
  expect(control.words).toEqual([
    'A practical ShortHand workflow',
    'Start with the record, then write the email',
    'A template gives you the structure. ShortHand keeps the specific details ready so the message can stay factual.',
    '1Log the behavior and context',
    '2Keep the dated notes with the student',
    '3Turn those notes into a parent email draft',
    'Draft from your notes',
  ]);
  expect(control.link).toBe('https://app.getshorthandapp.com?demo=true');
  expect(control.before).toBe('Why it works:');
  expect(control.after).toBe('HR');
});

test('desktop: the control is a boxed card, the variant an unboxed section with three columns', async ({ page, context }) => {
  await standIn(page, { value: 'control' });
  await page.goto(POST);
  expect(await css(page, CTA, 'border-radius')).toBe('16px');
  expect(await css(page, CTA, 'background-image')).toContain('gradient');
  expect(await css(page, `${CTA}__title`, 'font-size')).toBe('19.2px');

  const variant = await context.newPage();
  await standIn(variant, { value: 'test' });
  await variant.goto(POST);
  await expect(cta(variant)).toHaveClass(EDITORIAL);

  // No box: no fill, no side or bottom border, no rounding, text on the article's own left edge.
  expect(await css(variant, CTA, 'background-image')).toBe('none');
  expect(await css(variant, CTA, 'background-color')).toBe('rgba(0, 0, 0, 0)');
  expect(await css(variant, CTA, 'border-radius')).toBe('0px');
  expect(await css(variant, CTA, 'border-left-width')).toBe('0px');
  expect(await css(variant, CTA, 'border-bottom-width')).toBe('0px');
  expect(await css(variant, CTA, 'padding-left')).toBe('0px');
  // The orange rule, across the whole text column.
  expect(await css(variant, CTA, 'border-top-width')).toBe('3px');
  expect(await css(variant, CTA, 'border-top-color')).toBe('rgb(249, 115, 22)');
  const widths = await variant.evaluate((sel) => [document.querySelector(sel)!.clientWidth, document.querySelector('.blog-content > div')!.clientWidth], CTA);
  expect(widths[0]).toBe(widths[1]);

  // A headline larger than the post's own section headings, body copy at article size.
  expect(await css(variant, `${CTA}__title`, 'font-size')).toBe('28px');
  expect(parseFloat(await css(variant, `${CTA}__title`, 'font-size'))).toBeGreaterThan(parseFloat(await css(variant, '.blog-content h2', 'font-size')));
  expect(await css(variant, `${CTA}__description`, 'font-size')).toBe(await css(variant, '.blog-content > div > p', 'font-size'));
  expect(parseFloat(await css(variant, `${CTA}__eyebrow`, 'font-size'))).toBeGreaterThan(parseFloat(await css(page, `${CTA}__eyebrow`, 'font-size')));

  // Three columns, each a solid orange number above its step.
  const steps = await stepBoxes(variant);
  expect(steps).toHaveLength(3);
  expect(new Set(steps.map((s) => s.y)).size).toBe(1);
  expect(steps[0].x).toBeLessThan(steps[1].x);
  expect(steps[1].x).toBeLessThan(steps[2].x);
  expect(await css(variant, `${CTA} li`, 'flex-direction')).toBe('column');
  expect(await css(variant, `${CTA} li > span`, 'background-color')).toBe('rgb(249, 115, 22)');

  // The same orange pill, larger.
  expect(await css(variant, `${CTA}__cta`, 'background-color')).toBe(await css(page, `${CTA}__cta`, 'background-color'));
  expect(await css(variant, `${CTA}__cta`, 'border-radius')).toBe(await css(page, `${CTA}__cta`, 'border-radius'));
  expect(parseFloat(await css(variant, `${CTA}__cta`, 'font-size'))).toBeGreaterThan(parseFloat(await css(page, `${CTA}__cta`, 'font-size')));
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the control is unchanged', async ({ page }) => {
    await standIn(page, { value: 'control' });
    await page.goto(POST);
    await expect(cta(page)).not.toHaveClass(EDITORIAL);
    expect(await css(page, CTA, 'border-radius')).toBe('16px');
    expect(await css(page, CTA, 'padding-left')).toBe('19.2px');
    expect(await css(page, `${CTA}__title`, 'font-size')).toBe('19.2px');
  });

  test('the variant stacks its steps as rows, number on the left, and fits the screen', async ({ page }) => {
    await standIn(page, { value: 'test' });
    await page.goto(POST);
    await expect(cta(page)).toHaveClass(EDITORIAL);

    expect(await css(page, `${CTA}__title`, 'font-size')).toBe('24px');
    expect(await css(page, CTA, 'border-top-width')).toBe('3px');
    expect(await css(page, CTA, 'background-image')).toBe('none');

    const steps = await stepBoxes(page);
    expect(new Set(steps.map((s) => s.x)).size).toBe(1);
    expect(steps[0].y).toBeLessThan(steps[1].y);
    expect(steps[1].y).toBeLessThan(steps[2].y);
    expect(await css(page, `${CTA} li`, 'flex-direction')).toBe('row');
    // Number beside its step, not above it.
    for (const step of steps) expect(step.numberBottom).toBeLessThanOrEqual(step.bottom + 1);
    for (const step of steps) expect(step.numberRight).toBeLessThan(step.right - 100);

    const [contentWidth, screenWidth, ctaRight] = await page.evaluate(
      (sel) => [document.documentElement.scrollWidth, document.documentElement.clientWidth, document.querySelector(sel)!.getBoundingClientRect().right],
      CTA,
    );
    expect(contentWidth).toBeLessThanOrEqual(screenWidth);
    expect(ctaRight).toBeLessThanOrEqual(screenWidth);
  });

  test('seen, then paused, are recorded on a phone too', async ({ page }) => {
    const { tracked, seen } = await standIn(page, { value: 'test' });
    await page.goto(POST);
    await expect(cta(page)).toHaveClass(EDITORIAL);
    await show(page);
    await expect.poll(() => seen).toEqual([KEY]);
    await expect.poll(() => tracked).toEqual([PAUSE]);
  });
});

test('a visitor is counted as having seen it when it scrolls into view, not on page load', async ({ page }) => {
  const { tracked, asked, seen } = await standIn(page, { value: 'test' });
  await page.goto(POST);
  await expect(cta(page)).toHaveClass(EDITORIAL);
  await page.waitForTimeout(LONGER_THAN_A_PAUSE);
  expect(asked).toContain(KEY);
  expect([seen, tracked]).toEqual([[], []]);

  await show(page);
  await expect.poll(() => seen).toEqual([KEY]);
});

test('two seconds on screen is a pause, recorded once, with the variant and no text', async ({ page }) => {
  const { tracked, seen } = await standIn(page, { value: 'test' });
  await page.goto(POST);
  await expect(cta(page)).toHaveClass(EDITORIAL);

  await show(page);
  await page.waitForTimeout(1500);
  expect(tracked).toEqual([]);
  await expect.poll(() => tracked).toEqual([PAUSE]);

  // Coming back to it later on the same page view does not count again.
  await leave(page);
  await page.waitForTimeout(300);
  await show(page);
  await page.waitForTimeout(LONGER_THAN_A_PAUSE);
  expect(tracked).toEqual([PAUSE]);
  expect(seen).toEqual([KEY]);
});

test('scrolling past it quickly is seen but is not a pause', async ({ page }) => {
  const { tracked, seen } = await standIn(page, { value: 'test' });
  await page.goto(POST);
  await expect(cta(page)).toHaveClass(EDITORIAL);

  await show(page);
  await expect.poll(() => seen).toEqual([KEY]);
  await page.waitForTimeout(700);
  await leave(page);
  await page.waitForTimeout(LONGER_THAN_A_PAUSE);
  expect(tracked).toEqual([]);

  // The two seconds start again from nothing: two short looks do not add up.
  await show(page);
  await page.waitForTimeout(1400);
  expect(tracked).toEqual([]);
  await expect.poll(() => tracked).toEqual([PAUSE]);
});

// A reader copies a template and switches to their email with the post open.
test('time with the tab in the background does not count toward a pause', async ({ page }) => {
  const { tracked } = await standIn(page, { value: 'test' });
  await page.goto(POST);
  await expect(cta(page)).toHaveClass(EDITORIAL);
  const setHidden = (hidden: boolean) =>
    page.evaluate((value) => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => value });
      document.dispatchEvent(new Event('visibilitychange'));
    }, hidden);

  await show(page);
  await setHidden(true);
  await page.waitForTimeout(LONGER_THAN_A_PAUSE);
  expect(tracked).toEqual([]);

  await setHidden(false);
  await expect.poll(() => tracked).toEqual([PAUSE]);
});

test('the control is measured the same way', async ({ page }) => {
  const { tracked, seen } = await standIn(page, { value: 'control' });
  await page.goto(POST);
  await page.waitForTimeout(400);
  await show(page);

  await expect.poll(() => seen).toEqual([KEY]);
  await expect.poll(() => tracked).toEqual([['blog_cta_paused', { cta_type: 'workflow_bridge', variant: 'control' }]]);
  await expect(cta(page)).not.toHaveClass(EDITORIAL);
});

test('a flag that arrives after the reader reached the call to action changes nothing', async ({ page }) => {
  const { tracked, seen } = await standIn(page, { value: 'test', afterMs: 2500 });
  await page.goto(POST);
  await show(page);
  const heightBefore = (await cta(page).boundingBox())!.height;
  await page.waitForTimeout(2500 + LONGER_THAN_A_PAUSE);

  await expect(cta(page)).not.toHaveClass(EDITORIAL);
  expect((await cta(page).boundingBox())!.height).toBe(heightBefore);
  expect([seen, tracked]).toEqual([[], []]);
});

test('a value that is not a listed variant leaves the control, unmeasured', async ({ page }) => {
  for (const value of ['banana', true, false]) {
    const fresh = await page.context().newPage();
    const { tracked, seen } = await standIn(fresh, { value });
    await fresh.goto(POST);
    await fresh.waitForTimeout(400);
    await show(fresh);
    await fresh.waitForTimeout(LONGER_THAN_A_PAUSE);

    await expect(cta(fresh)).not.toHaveClass(EDITORIAL);
    expect([seen, tracked], String(value)).toEqual([[], []]);
    await fresh.close();
  }
});

test('the experiment is on one post only: the same card elsewhere is never asked about', async ({ page }) => {
  const { tracked, asked, seen } = await standIn(page, { value: 'test' });
  await page.goto(OTHER_BRIDGE_POST);
  await show(page);
  await page.waitForTimeout(LONGER_THAN_A_PAUSE);

  await expect(cta(page)).not.toHaveClass(EDITORIAL);
  expect([tracked, asked, seen]).toEqual([[], [], []]);
});

for (const value of ['control', 'test']) {
  test(`the button opens the app demo (${value})`, async ({ page }) => {
    await page.route(/app\.getshorthandapp\.com/, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: 'stand-in' }));
    await standIn(page, { value });
    await page.goto(POST);
    if (value === 'test') await expect(cta(page)).toHaveClass(EDITORIAL);
    await page.locator(`${CTA} a`).click();
    await page.waitForURL(/app\.getshorthandapp\.com/);
    const landed = new URL(page.url());
    expect(landed.hostname).toBe('app.getshorthandapp.com');
    expect(landed.searchParams.get('demo')).toBe('true');
  });
}

// Preview deployments have no PostHog, so ?cta= stands in for the flag there.
// localhost is not the production hostname either, which is what makes this
// testable here. That production ignores it is covered in the unit tests and
// in the manual privacy check.
test.describe('the preview switch', () => {
  test('?cta=variant forces the variant and shows what would be recorded', async ({ page }) => {
    await page.goto(`${POST}?cta=variant`);
    await expect(cta(page)).toHaveClass(EDITORIAL);
    const badge = page.locator('[data-cta-preview="test"]');
    await expect(badge).toContainText('VARIANT');
    await expect(badge).toContainText('Seen: no');
    await expect(badge).toContainText('Paused 2s: no');

    await show(page);
    await expect(badge).toContainText('Seen: YES');
    await expect(badge).toContainText('Paused 2s: no');
    await expect(badge).toContainText('Paused 2s: YES', { timeout: 4000 });
  });

  test('?cta=control forces the control', async ({ page }) => {
    await page.goto(`${POST}?cta=control`);
    await expect(page.locator('[data-cta-preview="control"]')).toContainText('CONTROL');
    await expect(cta(page)).not.toHaveClass(EDITORIAL);
    await show(page);
    await expect(page.locator('[data-cta-preview]')).toContainText('Paused 2s: YES', { timeout: 4000 });
  });

  test('it works from anywhere on the page, and does not reach other posts', async ({ page }) => {
    await page.goto(`${POST}?cta=variant`);
    await show(page);
    await page.reload();
    await expect(cta(page)).toHaveClass(EDITORIAL);

    await page.goto(`${OTHER_BRIDGE_POST}?cta=variant`);
    await page.waitForTimeout(600);
    await expect(cta(page)).not.toHaveClass(EDITORIAL);
    await expect(page.locator('[data-cta-preview]')).toHaveCount(0);
  });
});
