import { expect, test } from '@playwright/test';

test('generates a report card comment without requiring an email', async ({ page }) => {
  await page.route('**/rest/v1/email_leads*', async (route) => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
  });

  await page.route('**/api/free-tool', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ comment: 'Alex has had a strong term in reading and writing.' }),
    });
  });

  await page.goto('http://localhost:3000/report-card-comment-generator');

  await expect(page.getByRole('heading', { name: 'Report Card Comment Generator', exact: true })).toBeVisible();
  await expect(page.getByLabel('Email address')).toHaveCount(0);
  await expect(page.getByText('Get instant access')).toHaveCount(0);

  await page.getByPlaceholder('e.g. Alex').fill('Alex');
  await page.getByRole('button', { name: 'Math' }).first().click();
  await page.getByRole('button', { name: /Generate comment/ }).click();

  await expect(page.getByText('Alex has had a strong term in reading and writing.')).toBeVisible();

  await expect(page.getByText('Optional', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email address')).toBeVisible();

  await page.getByLabel('Email address').fill('teacher@example.com');
  await page.getByRole('button', { name: 'Keep me posted' }).click();
  await expect(page.getByRole('status')).toHaveText("You're on the list for future teacher tools and resources.");
});
