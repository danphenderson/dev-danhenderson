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
    launchOptions: { chromiumSandbox: true },
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
    {
      name: 'mobile-chromium',
      testMatch: /asset-delivery\.smoke\.spec\.ts/,
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-webkit',
      testMatch: /asset-delivery\.smoke\.spec\.ts/,
      // Original-photo recovery is memory-heavy; do not run these WebKit cases together.
      fullyParallel: false,
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_SERVE_DIR
      ? `serve -s "$PLAYWRIGHT_SERVE_DIR" -l ${PORT}`
      : `serve -s build -l ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI && !process.env.PLAYWRIGHT_SERVE_DIR,
  },
});
