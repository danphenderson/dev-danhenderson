import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect, type Locator, type Page } from '@playwright/test';
import { waitForClimbingContent } from './helpers/climbing';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

/**
 * Production smoke suite.
 *
 * Validates that core public routes render,
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

    await waitForClimbingContent(page);

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
    await waitForClimbingContent(page);

    await expect(main.getByText('Routes Climbed', { exact: true })).toBeVisible();
  });

  test('/photography loads album cards', async ({ page }) => {
    await page.goto('/photography');

    await waitForAnimatedSectionReadiness({
      anchor: page.getByText('A collection of photo albums.'),
      readyLocators: [page.getByText('4 albums')],
    });

    await expect(page.getByRole('heading', { name: 'Landscape' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronomy' })).toBeVisible();
  });

  test('/blog loads in production', async ({ page }) => {
    await page.goto('/blog');

    const main = page.locator('#main-content');
    await expect(main.getByText('Blog').first()).toBeVisible();
    await expect(main.getByText('1 article')).toBeVisible();
  });

  test('/blog/:slug loads in production', async ({ page }) => {
    await page.goto('/blog/fixing-and-enforcing-none-type-drift-with-a-codemod');

    const main = page.locator('#main-content');
    await expect(
      main.getByRole('heading', { name: 'Fixing and Enforcing None-Type Drift with a Codemod' })
    ).toBeVisible();
  });

  test('header shows Blog link in production', async ({ page }) => {
    await page.goto('/climbing');

    await expect(page.locator('#main-content')).toBeVisible();

    await expect(page.getByRole('link', { name: 'CV' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' }).first()).toBeVisible();
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
