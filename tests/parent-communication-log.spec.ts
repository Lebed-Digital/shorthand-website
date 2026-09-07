import { expect, test } from '@playwright/test';

test('parent communication log: fill fields, add rows, and toggle print view', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/parent-communication-log');

  await expect(page.getByRole('heading', { name: 'Free Parent Communication Log' })).toBeVisible();

  await page.getByPlaceholder('Your name').fill('Ms. Rivera');
  await expect(page.getByPlaceholder('Your name')).toHaveValue('Ms. Rivera');

  await page.getByPlaceholder('Student name').first().fill('Jordan P.');
  await page.locator('select').first().selectOption('Call');
  await page.locator('select').nth(1).selectOption('Voicemail');
  await page.getByPlaceholder('What was discussed / decided').first().fill('Left VM about missing homework.');
  await page.locator('select').nth(2).selectOption('Yes, see notes');

  await expect(page.getByPlaceholder('Student name').first()).toHaveValue('Jordan P.');
  await expect(page.getByPlaceholder('What was discussed / decided').first()).toHaveValue(
    'Left VM about missing homework.'
  );

  const rowsBefore = await page.locator('tbody tr').count();
  expect(rowsBefore).toBe(10);

  await page.getByRole('button', { name: '+ Add 5 rows' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(15);

  // First row's data survives the row-count change (state keyed correctly).
  await expect(page.getByPlaceholder('Student name').first()).toHaveValue('Jordan P.');

  await page.getByRole('button', { name: '+ Add 5 more rows' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(20);

  // Print stylesheet: nav/toolbar/CTA hidden, print-only footer text shown.
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('link', { name: '← ShortHand' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeHidden();
  await expect(page.getByRole('button', { name: '+ Add 5 rows' })).toBeHidden();
  await expect(page.getByRole('button', { name: '+ Add 5 more rows' })).toBeHidden();
  await expect(page.getByText('Want this to happen automatically?')).toBeHidden();
  await expect(page.getByText('Try ShortHand free at getshorthandapp.com.')).toBeVisible();

  // The actual log content must survive into print — this is the real point of
  // the page. A regression here (e.g. a global fixed overlay painting over
  // printed content) would leave the toolbar assertions above passing while
  // the printed page is still effectively blank.
  await expect(page.getByRole('heading', { name: 'Free Parent Communication Log' })).toBeVisible();
  await expect(page.getByText('Fill it in here and print, or print blank and fill by hand.')).toBeVisible();
  await expect(page.getByText('Teacher Name')).toBeVisible();
  await expect(page.getByPlaceholder('Your name')).toBeVisible();
  await expect(page.getByPlaceholder('Your name')).toHaveValue('Ms. Rivera');
  await expect(page.getByText('Week of')).toBeVisible();
  for (const col of ['Date', 'Student Name', 'Method', 'Reached?', 'Summary / Notes', 'Follow-up?']) {
    await expect(page.getByRole('columnheader', { name: col })).toBeVisible();
  }
  await expect(page.getByPlaceholder('Student name').first()).toBeVisible();
  await expect(page.getByPlaceholder('Student name').first()).toHaveValue('Jordan P.');
  await expect(page.getByPlaceholder('What was discussed / decided').first()).toBeVisible();
  await expect(page.getByPlaceholder('What was discussed / decided').first()).toHaveValue(
    'Left VM about missing homework.'
  );
  await expect(page.locator('tbody tr')).toHaveCount(20);

  // Guard against the actual root cause of the blank-print bug: a global
  // fixed, full-viewport pseudo-element (app/globals.css `body::after`) with
  // no print exclusion, which Chrome's print engine paints over page content.
  const overlayDisplay = await page.evaluate(
    () => getComputedStyle(document.body, '::after').display
  );
  expect(overlayDisplay).toBe('none');
});
