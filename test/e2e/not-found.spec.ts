import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

const NOT_FOUND_REOPEN_CAPTION =
  'Press `/` or `Cmd+K` at any time to reopen the palette after dismissing it.';

const waitForContextualNotFoundRecovery = async (page: Page) => {
  const main = page.locator('main');

  await waitForAnimatedSectionReadiness({
    anchor: main.getByRole('heading', { name: '404 Not Found' }),
    readyLocators: [
      main.getByText(/^Route recovery$/),
      main.getByText("The page you're looking for doesn't exist."),
      main.getByText(NOT_FOUND_REOPEN_CAPTION),
      main.getByRole('heading', { name: 'Suggested destinations' }),
      main.getByRole('heading', { name: 'Shared recovery routes' }),
      main.getByRole('link', { name: 'Open CV: About' }),
    ],
  });
};

test.describe('Not Found page', () => {
  test('opens a prefilled command palette for contextual recovery on unknown routes', async ({
    page,
  }) => {
    await page.goto('/cv/abou');
    const main = page.locator('main');

    await waitForContextualNotFoundRecovery(page);
    await expect(main.getByText('Attempted path')).toBeVisible();
    await expect(main.getByText('/cv/abou', { exact: true })).toBeVisible();

    await main.getByRole('button', { name: 'Open command palette' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(1);
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('textbox', { name: 'Search routes, albums, and CV sections' })
    ).toHaveValue('abou');
    const aboutAction = dialog.getByRole('button', { name: /CV: About/ });
    await expect(aboutAction).toBeVisible();

    await aboutAction.click();
    await expect(page).toHaveURL(/\/cv#cv-about$/);
  });

  test('keeps shared recovery routes available after dismissing the palette', async ({ page }) => {
    await page.goto('/unknown');
    await page.getByRole('button', { name: 'Open command palette' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    const main = page.locator('main');
    await expect(main.getByRole('heading', { name: 'Shared recovery routes' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Go home' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Open CV' }).first()).toBeVisible();
    await expect(main.getByRole('link', { name: 'Open Climbing' }).first()).toBeVisible();
    await expect(main.getByRole('link', { name: 'Open Photography' }).first()).toBeVisible();
    await expect(main.getByText(/reopen the palette after dismissing it/)).toBeVisible();
  });
});
