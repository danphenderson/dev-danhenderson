import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Photography page', () => {
  test('renders category cards', async ({ page }) => {
    await page.goto('/photography');
    await expect(page.getByRole('heading', { name: 'Landscape' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronomy' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New Mexico' })).toBeVisible();
  });

  test('navigates to a category via slug', async ({ page }) => {
    await page.goto('/photography/landscape');
    await expect(page.getByText('Landscape photo collection')).toBeVisible();
  });
});
