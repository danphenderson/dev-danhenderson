import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero content after completing the welcome sequence', async ({ page }) => {
    await page.goto('/');

    // Step 1: Dismiss the welcome audio prompt
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'No thanks' }).click();
    await expect(dialog).toBeHidden();

    // Step 2: Dismiss the dark mode hint popover that appears after audio prompt
    const darkModeHint = page.getByText(/Try (light|dark) mode/i);
    await expect(darkModeHint).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(darkModeHint).toBeHidden();

    // Hero text should appear after the full welcome sequence completes
    await expect(
      page.getByText('Hi, my passions are mathematics, computers, and adventures')
    ).toBeVisible();
  });

  test('welcome audio prompt can be dismissed', async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Play welcome audio?')).toBeVisible();
    await dialog.getByRole('button', { name: 'No thanks' }).click();
    await expect(dialog).toBeHidden();
  });
});
