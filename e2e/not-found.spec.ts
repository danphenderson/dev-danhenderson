import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Not Found page', () => {
  test('renders 404 for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404 Not Found')).toBeVisible();
    await expect(
      page.getByText("The page you're looking for doesn't exist."),
    ).toBeVisible();
  });

  test('provides navigation links back to known routes', async ({ page }) => {
    await page.goto('/unknown');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CV' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Photography' }).first()).toBeVisible();
  });
});
