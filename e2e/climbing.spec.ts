import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Climbing page', () => {
  test('renders climbing route tables', async ({ page }) => {
    await page.goto('/climbing');
    await expect(page.getByText('Climbing').first()).toBeVisible();
    await expect(page.getByText('TODO Routes')).toBeVisible();
  });
});
