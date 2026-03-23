import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
// Shared Playwright concurrency is owned here; docs and workflows should not restate it.
const PLAYWRIGHT_WORKERS = 4;

export default defineConfig({
  testDir: './test/e2e',
  outputDir: './e2e-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: PLAYWRIGHT_WORKERS,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke',
      testMatch: /smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `serve -s build -l ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
