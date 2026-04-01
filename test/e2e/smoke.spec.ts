import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

/**
 * Production smoke suite.
 *
 * Validates that all non-gated routes render, blog routes are blocked,
 * and SPA direct-link routing works against the production build output.
 */

const PACKAGE_VERSION = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
) as {
  version: string;
};

const suppressWelcomeDialog = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');
  });
};

const getScorecardValue = (dialog: Locator, label: string) =>
  dialog.locator(`xpath=.//span[normalize-space()="${label}"]/following-sibling::span[1]`);

test.describe('Production smoke', () => {
  test.beforeEach(async ({ page }) => {
    await suppressWelcomeDialog(page);
  });

  test('/ loads and renders hero content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('production footer scorecard shows stamped build metadata', async ({ page }) => {
    await page.goto('/climbing');

    const main = page.locator('#main-content');
    await waitForAnimatedSectionReadiness({
      anchor: main.getByRole('heading', { name: 'Overview' }),
      readyLocators: [main.getByRole('table').first()],
    });

    const scorecardTrigger = page.getByRole('button', { name: 'Open performance scorecard' });
    await scorecardTrigger.scrollIntoViewIfNeeded();
    await expect(scorecardTrigger).toBeVisible();
    await scorecardTrigger.click();

    const dialog = page.getByRole('dialog', { name: 'Performance & Build Info' });
    await expect(dialog).toBeVisible();

    await expect(getScorecardValue(dialog, 'Version')).toHaveText(PACKAGE_VERSION.version);
    await expect(getScorecardValue(dialog, 'Commit')).toHaveText(/^[0-9a-f]{7,}$/);
    await expect(getScorecardValue(dialog, 'Built')).not.toHaveText('unknown');
    await expect(getScorecardValue(dialog, 'Environment')).toHaveText('production');
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
      anchor: main.getByRole('heading', { name: 'Overview' }),
      readyLocators: [main.getByRole('table').first()],
    });

    await expect(main.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });

  test('/photography loads album cards', async ({ page }) => {
    await page.goto('/photography');

    await waitForAnimatedSectionReadiness({
      anchor: page.getByText('A selection of photo albums.'),
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

    await expect(page.locator('#main-content')).toBeVisible();

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
