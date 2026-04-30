import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  expect: { timeout: 5000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop 1280x720',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Tablet 768x1024',
      use: { ...devices['iPad (gen 7)'] },
    },
    {
      name: 'Mobile 375x812',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
