import { test, expect, type Page } from '@playwright/test';
import { declineWelcomeAudio, dismissHeaderSettingsHint } from './helpers/header';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

/**
 * Cross-route navigation suite.
 *
 * Validates that header links navigate between primary routes and that
 * browser back-button behavior works correctly.
 */

test.describe('Cross-route navigation', () => {
  test.beforeEach(async ({ page }) => {
    await declineWelcomeAudio(page);
  });

  test('Home → CV via header link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-content')).toBeVisible();

    await dismissHeaderSettingsHint(page);

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
      anchor: main.getByRole('heading', { name: 'Overview' }),
      readyLocators: [main.getByRole('grid').first()],
    });
    await expect(main.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });

  test('Climbing → Photography via header link', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByRole('heading', { name: 'Overview' }),
      readyLocators: [main.getByRole('grid').first()],
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
      anchor: main.getByRole('heading', { name: 'Overview' }),
      readyLocators: [main.getByRole('grid').first()],
    });

    await page.goBack();

    await expect(page).toHaveURL(/\/cv$/);
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });
    await expect(main.getByText('Daniel Henderson')).toBeVisible();
  });
});
