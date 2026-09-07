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

  // Print stylesheet: toolbar/CTA hidden, print-only footer text shown.
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeHidden();
  await expect(page.getByRole('button', { name: '+ Add 5 rows' })).toBeHidden();
  await expect(page.getByText('Want this to happen automatically?')).toBeHidden();
  await expect(page.getByText('Try ShortHand free at getshorthandapp.com.')).toBeVisible();
});
