import { test, expect } from '@playwright/test';

// /behavior is spoken and shown on screen in the "Describe the Behavior, Not the Kid" video, so it has to
// reach the behavior comments post. Same two-rule pattern as /chart, /glance and /freebies.
const POST = '/blog/report-card-comments-for-behavior';

test('/behavior redirects to the behavior comments post with the house UTMs', async ({ request }) => {
  const res = await request.get('/behavior', { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  const loc = res.headers().location;
  expect(loc.startsWith(`${POST}?`)).toBe(true);
  const q = new URLSearchParams(loc.split('?')[1]);
  expect(q.get('utm_source')).toBe('social');
  expect(q.get('utm_medium')).toBe('organic_social');
  expect(q.get('utm_campaign')).toBe('report_card_behavior');
});

test('a /behavior link that already carries its own utm_source keeps it', async ({ request }) => {
  const res = await request.get('/behavior?utm_source=facebook&utm_content=facebook_behavior', { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  const loc = res.headers().location;
  expect(loc.startsWith(POST)).toBe(true);
  const q = new URLSearchParams(loc.split('?')[1] ?? '');
  expect(q.get('utm_source')).toBe('facebook');
  expect(q.get('utm_content')).toBe('facebook_behavior');
  expect(q.get('utm_campaign')).toBeNull();
});

test('the post the shortlink points to loads', async ({ page }) => {
  const res = await page.goto('/behavior');
  expect(res?.status()).toBe(200);
  await expect(page).toHaveURL(/\/blog\/report-card-comments-for-behavior/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
