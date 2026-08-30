import { expect, test } from '@playwright/test';

test('generates a first welcome letter without requiring an email', async ({ page }) => {
  await page.route('**/rest/v1/email_leads*', async (route) => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
  });

  await page.route('**/api/welcome-letter', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ letter: 'Dear Families,\n\nWelcome to our classroom!' }),
    });
  });

  await page.goto('http://localhost:3000/back-to-school-toolkit');

  await expect(page.getByRole('heading', { name: 'Welcome Letter Generator' })).toBeVisible();
  await expect(page.getByPlaceholder('e.g. Ms. Johnson')).toBeVisible();
  await expect(page.getByLabel('Email address')).toHaveCount(0);

  await page.getByPlaceholder('e.g. Ms. Johnson').fill('Ms. Johnson');
  await page.locator('select').selectOption('3rd Grade');
  await page.getByRole('button', { name: /Generate letter/ }).click();

  await expect(page.locator('textarea').first()).toHaveValue('Dear Families,\n\nWelcome to our classroom!');
  await expect(page.getByText('Optional', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByText('Your letter is already ready to use.')).toBeVisible();

  await page.getByLabel('Email address').fill('teacher@example.com');
  await page.getByRole('button', { name: 'Keep me posted' }).click();
  await expect(page.getByRole('status')).toHaveText("You're on the list for future teacher tools and resources.");
});
