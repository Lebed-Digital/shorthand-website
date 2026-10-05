import { test, expect, type Page } from '@playwright/test';

/**
 * blog_example_copied (lib/posthog-events.ts, components/BlogExampleCopyTracker.tsx).
 *
 * The contract:
 *   1. Copying from a designated example fires the event once, saying which
 *      kind of example and which one by position.
 *   2. Copying anything else on the page fires nothing.
 *   3. The copied text is never part of the event.
 *
 * PostHog does not run on localhost, so these tests stand in for the tracker
 * that captureEvent() looks for and record what it is handed.
 */

type Tracked = [string, Record<string, unknown>];

const BLOCKQUOTE_POST = '/blog/sample-emails-to-parents-about-student-behavior';
const PLAIN_TEMPLATE_POST = '/blog/positive-behavior-email-to-parents-template';
const COMMENT_POST = '/blog/report-card-comments-for-behavior';
const UNLISTED_POST = '/blog/special-education-behavior-tracking-software';

const SUBJECT_LINE = '.blog-content p:has(> strong:text-is("Subject:"))';

async function captureTracked(page: Page): Promise<Tracked[]> {
  const tracked: Tracked[] = [];
  await page.exposeFunction('__recordTracked', (name: string, props: Record<string, unknown>) => {
    tracked.push([name, props]);
  });
  await page.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__shTrack = (name: string, props: unknown) => (window as any).__recordTracked(name, props);
  });
  return tracked;
}

/** Selects the whole of the nth element matching `selector`, then copies with the keyboard. */
async function selectAndCopy(page: Page, selector: string, nth = 0) {
  await page.locator(selector).nth(nth).evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  });
  await page.keyboard.press('Control+C');
}

const settle = (page: Page) => page.waitForTimeout(400);

test('copying from a blockquote template fires once, with kind and position and no text', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(BLOCKQUOTE_POST);

  await selectAndCopy(page, '.blog-content blockquote p', 1);

  await expect.poll(() => tracked.length).toBe(1);
  expect(tracked[0]).toEqual([
    'blog_example_copied',
    { example_type: 'email', example_number: '1', copy_method: 'text_selection' },
  ]);
});

test('the second template reports position 2, and a subject line counts as part of its template', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(BLOCKQUOTE_POST);

  await selectAndCopy(page, '.blog-content blockquote', 1);
  await expect.poll(() => tracked.length).toBe(1);
  await selectAndCopy(page, SUBJECT_LINE, 0);
  await expect.poll(() => tracked.length).toBe(2);

  expect(tracked.map(([, props]) => props.example_number)).toEqual(['2', '1']);
});

test('copying prose, a heading, or the FAQ fires nothing', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(BLOCKQUOTE_POST);

  await selectAndCopy(page, '.blog-content p', 0);
  await selectAndCopy(page, '.blog-content h2', 0);
  await selectAndCopy(page, '.blog-content p:has(> strong:text-is("Why it works:"))', 0);
  await selectAndCopy(page, 'h1');
  await selectAndCopy(page, 'details summary', 0);
  await settle(page);

  expect(tracked).toEqual([]);
});

// A real triple-click ends its selection at the start of the NEXT block. The
// paragraph above the first template must not be counted as that template.
test('triple-clicking the paragraph above a template fires nothing', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(BLOCKQUOTE_POST);

  await page.locator(SUBJECT_LINE).first().locator('xpath=preceding-sibling::p[1]').click({ clickCount: 3 });
  await page.keyboard.press('Control+C');
  await settle(page);
  expect(tracked).toEqual([]);

  // Positive control: the same gesture inside the template does fire.
  await page.locator('.blog-content blockquote p').nth(1).click({ clickCount: 3 });
  await page.keyboard.press('Control+C');
  await expect.poll(() => tracked.length).toBe(1);
});

test('a plain-paragraph template counts from its Subject line to [Your Name], and not past it', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(PLAIN_TEMPLATE_POST);

  // The greeting of the third template.
  await selectAndCopy(page, '.blog-content p:text-is("Dear [Parent Name],")', 2);
  await expect.poll(() => tracked.length).toBe(1);
  expect(tracked[0][1]).toEqual({ example_type: 'email', example_number: '3', copy_method: 'text_selection' });

  // The "Use this when..." line under a template heading is not the template.
  await selectAndCopy(page, '.blog-content h3 + p', 0);
  // Neither is the section that follows the last template.
  await selectAndCopy(page, '.blog-content h2:text-is("How to Make Positive Emails a Habit") + p');
  await settle(page);
  expect(tracked.length).toBe(1);
});

test('a report card comment reports its own position, and the jump links fire nothing', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(COMMENT_POST);

  await selectAndCopy(page, '.blog-content li:has(a[href^="#"])', 0);
  await settle(page);
  expect(tracked).toEqual([]);

  await selectAndCopy(page, '.blog-content h2:text-is("When behavior is strong") + ul li', 2);
  await expect.poll(() => tracked.length).toBe(1);
  expect(tracked[0][1]).toEqual({ example_type: 'report_card_comment', example_number: '3', copy_method: 'text_selection' });
});

// Two posts write every comment as **Label:** "comment". Without the label
// rule they would be listed for tracking and never fire.
test('a comment written after a bold label still counts', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto('/blog/report-card-comments-for-students-with-adhd');

  await selectAndCopy(page, '.blog-content ol li', 1);

  await expect.poll(() => tracked.length).toBe(1);
  expect(tracked[0][1]).toEqual({ example_type: 'report_card_comment', example_number: '2', copy_method: 'text_selection' });
});

test('pressing copy twice on the same example fires once', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(BLOCKQUOTE_POST);

  await selectAndCopy(page, '.blog-content blockquote', 0);
  await page.keyboard.press('Control+C');
  await page.keyboard.press('Control+C');
  await settle(page);

  expect(tracked.length).toBe(1);
});

test('a post that is not listed fires nothing, even from a blockquote', async ({ page }) => {
  const tracked = await captureTracked(page);
  await page.goto(UNLISTED_POST);

  await selectAndCopy(page, '.blog-content blockquote', 0);
  await settle(page);

  expect(tracked).toEqual([]);
});
