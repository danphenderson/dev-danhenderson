import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero content after completing the welcome sequence', async ({ page }) => {
    await page.goto('/');

    // Step 1: Dismiss the welcome audio prompt
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'No thanks' }).click();
    await expect(dialog).toBeHidden();

    // Step 2: Dismiss the appearance hint popover that appears after audio prompt
    const darkModeHint = page.getByText(/Try an alternative theme/i);
    await expect(darkModeHint).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(darkModeHint).toBeHidden();

    // The terminal hero shell should be visible with the typed content
    const terminalHero = page.getByTestId('terminal-hero');
    await expect(terminalHero).toBeVisible();

    // The terminal should type the command and eventually show an output
    await expect(terminalHero).toContainText(/whoami --passions/, { timeout: 15000 });
    await expect(terminalHero).toContainText(/mathematics|computers|adventures/, {
      timeout: 15000,
    });
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
