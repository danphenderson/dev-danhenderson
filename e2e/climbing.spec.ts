import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Climbing page', () => {
  test('renders climbing route tables', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(
      main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
    ).toBeVisible();
    await expect(main.getByText('TODO Routes')).toBeVisible();
  });
});
