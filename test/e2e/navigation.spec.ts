import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

/**
 * Cross-route navigation suite.
 *
 * Validates that header links navigate between primary routes and that
 * browser back-button behavior works correctly.
 */

const suppressWelcomeDialog = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');
  });
};

test.describe('Cross-route navigation', () => {
  test.beforeEach(async ({ page }) => {
    await suppressWelcomeDialog(page);
  });

  test('Home → CV via header link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-content')).toBeVisible();

    // Dismiss the dark-mode hint popover that opens automatically on Home
    const darkModeHint = page.getByText(/Try an alternative theme/i);
    await expect(darkModeHint).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(darkModeHint).toBeHidden();

    await page.getByRole('link', { name: 'CV' }).first().click();

    await expect(page).toHaveURL(/\/cv$/);
    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });
    await expect(main.getByText('Daniel Henderson')).toBeVisible();
  });

  test('CV → Climbing via header link', async ({ page }) => {
    await page.goto('/cv');
    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });

    await page.getByRole('link', { name: 'Climbing' }).first().click();

    await expect(page).toHaveURL(/\/climbing$/);
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
      readyLocators: [main.getByText('Overview')],
    });
    await expect(main.getByText('Overview')).toBeVisible();
  });

  test('Climbing → Photography via header link', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
    });

    // Scroll to top to ensure HideOnScroll header is visible
    await page.evaluate(() => window.scrollTo(0, 0));
    const photographyLink = page.getByRole('link', { name: 'Photography' }).first();
    await expect(photographyLink).toBeVisible();
    await photographyLink.click();

    await expect(page).toHaveURL(/\/photography$/);
    await waitForAnimatedSectionReadiness({
      anchor: page.getByText('A selection of field work, climbing days, and stargazing nights.'),
      readyLocators: [page.getByText('4 albums')],
    });
    await expect(page.getByRole('heading', { name: 'Landscape' })).toBeVisible();
  });

  test('Photography → Home via logo link', async ({ page }) => {
    await page.goto('/photography');
    await waitForAnimatedSectionReadiness({
      anchor: page.getByText('A selection of field work, climbing days, and stargazing nights.'),
    });

    await page.getByRole('link', { name: 'Home' }).first().click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('browser back button returns to previous route', async ({ page }) => {
    await page.goto('/cv');
    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });

    await page.getByRole('link', { name: 'Climbing' }).first().click();
    await expect(page).toHaveURL(/\/climbing$/);
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
    });

    await page.goBack();

    await expect(page).toHaveURL(/\/cv$/);
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });
    await expect(main.getByText('Daniel Henderson')).toBeVisible();
  });
});
