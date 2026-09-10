import { defineConfig, devices } from '@playwright/test';

// The existing specs (resource-offer, welcome-letter, parent-communication-log,
// report-card-generator) were written against a manually started dev server on
// :3000 with no config file in the repo. This config makes that reproducible
// rather than changing it: same URL, and it starts `next dev` only if nothing
// is already listening there.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
