import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

/**
 * Production smoke suite.
 *
 * Validates that all non-gated routes render, blog routes are blocked,
 * and SPA direct-link routing works against the production build output.
 */

const suppressWelcomeDialog = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');
  });
};

test.describe('Production smoke', () => {
  test.beforeEach(async ({ page }) => {
    await suppressWelcomeDialog(page);
  });

  test('/ loads and renders hero content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('/cv loads core sections', async ({ page }) => {
    await page.goto('/cv');

    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });

    await expect(main.getByText('Daniel Henderson')).toBeVisible();
    await expect(main.getByTestId('cv-desktop-top-region')).toBeVisible();
  });

  test('/climbing loads route tables', async ({ page }) => {
    await page.goto('/climbing');

    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
      readyLocators: [main.getByText('Overview')],
    });

    await expect(main.getByText('Overview')).toBeVisible();
  });

  test('/photography loads album cards', async ({ page }) => {
    await page.goto('/photography');

    await waitForAnimatedSectionReadiness({
      anchor: page.getByText('A selection of field work, climbing days, and stargazing nights.'),
      readyLocators: [page.getByText('4 albums')],
    });

    await expect(page.getByRole('heading', { name: 'Landscape' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronomy' })).toBeVisible();
  });

  test('/blog is not routable in production', async ({ page }) => {
    await page.goto('/blog');

    const main = page.locator('#main-content');
    await expect(main.getByRole('heading', { name: '404 Not Found' })).toBeVisible();
  });

  test('/blog/:slug is not routable in production', async ({ page }) => {
    await page.goto('/blog/any-slug');

    const main = page.locator('#main-content');
    await expect(main.getByRole('heading', { name: '404 Not Found' })).toBeVisible();
  });

  test('header does not show Blog link in production', async ({ page }) => {
    await page.goto('/climbing');

    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
    });

    await expect(page.getByRole('link', { name: 'CV' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toHaveCount(0);
  });

  test('unknown routes render recovery panel', async ({ page }) => {
    await page.goto('/unknown-route');

    const main = page.locator('#main-content');
    await expect(main.getByRole('heading', { name: '404 Not Found' })).toBeVisible();
  });

  test('direct links resolve via SPA routing', async ({ page }) => {
    await page.goto('/cv');

    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByText('Daniel Henderson'),
    });

    await expect(page).toHaveURL(/\/cv$/);
    await expect(main.getByText('Daniel Henderson')).toBeVisible();
  });
});
