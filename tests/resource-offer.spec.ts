import { test, expect } from '@playwright/test';

/**
 * The contract these placements have to keep:
 *   1. The PDF downloads with NO email required.
 *   2. The optional email field only appears AFTER the download starts.
 *   3. Each placement reports its own source id, so article/resource pairings
 *      can be compared in GA4 instead of collapsing into one total.
 *
 * If a future change reintroduces a required gate, (1) and (2) fail here.
 */
const PLACEMENTS = [
  {
    slug: 'positive-behavior-email-to-parents-template',
    source: 'positive-email-post',
    file: 'Ready_to_Send_Behavior_Emails_x7k2.pdf',
  },
  {
    slug: 'teacher-documentation-log-template',
    source: 'documentation-log-post',
    file: 'classroom-behavior-documentation-log.pdf',
  },
  {
    slug: 'student-behavior-log-for-teachers',
    source: 'behavior-log-post',
    file: 'classroom-behavior-documentation-log.pdf',
  },
  {
    slug: 'free-behavior-log-template-for-teachers',
    source: 'free-behavior-log-post',
    file: 'classroom-behavior-documentation-log.pdf',
  },
  {
    slug: 'how-to-prepare-for-parent-teacher-conference',
    source: 'conference-prep-post',
    file: 'parent-teacher-conference-notes.pdf',
  },
  {
    slug: 'parent-teacher-conference-comments-for-teachers',
    source: 'conference-comments-post',
    file: 'parent-teacher-conference-notes.pdf',
  },
];

for (const { slug, source, file } of PLACEMENTS) {
  test(`${slug}: downloads ungated and reports source "${source}"`, async ({ page }) => {
    const captured: Array<[string, string, Record<string, string>]> = [];
    await page.exposeFunction('__recordEvent', (args: [string, string, Record<string, string>]) => {
      captured.push(args);
    });
    await page.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag = (...args: unknown[]) => (window as any).__recordEvent(args);
    });

    await page.goto(`http://localhost:3000/blog/${slug}`);

    const download = page.locator('a[download]').first();
    await expect(download).toBeVisible();

    // No email field is present before downloading: the file is not gated.
    await expect(page.locator('input[type="email"]')).toHaveCount(0);

    const [dl] = await Promise.all([page.waitForEvent('download'), download.click()]);
    expect(dl.suggestedFilename()).toBe(file);

    // The optional capture appears only after the download has started.
    await expect(page.locator('input[type="email"]')).toHaveCount(1);
    await expect(page.getByText('Optional')).toBeVisible();

    const event = captured.find((e) => e[1] === 'resource_download');
    expect(event, 'resource_download should fire').toBeTruthy();
    expect(event![2].resource_source).toBe(source);
    expect(event![2].resource_asset).toBe(`/${file}`);
    expect(event![2].resource_page).toBe(`/blog/${slug}`);
  });
}
