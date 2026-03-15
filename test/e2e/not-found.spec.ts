import { test, expect } from '@playwright/test';

test.describe('Not Found page', () => {
  test('renders 404 for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404 Not Found')).toBeVisible();
    await expect(page.getByText("The page you're looking for doesn't exist.")).toBeVisible();
  });

  test('provides navigation links back to known routes', async ({ page }) => {
    await page.goto('/unknown');
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: 'Go home' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Open CV' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Open Climbing' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Open Photography' })).toBeVisible();
    await expect(main.getByText(/Use one of the shared recovery routes below/)).toBeVisible();
  });
});
