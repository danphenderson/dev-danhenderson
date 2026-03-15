import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

const waitForPhotographySection = async (page: Page) => {
  await waitForAnimatedSectionReadiness({
    anchor: page.getByText('A selection of field work, climbing days, and stargazing nights.'),
    readyLocators: [page.getByText('4 albums')],
    hiddenLocators: [page.getByRole('status', { name: 'Loading photography albums' })],
  });
};

test.describe('Photography page', () => {
  test('renders category cards', async ({ page }) => {
    await page.goto('/photography');
    await waitForPhotographySection(page);
    await expect(page.getByRole('heading', { name: 'Landscape' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronomy' })).toBeVisible();
    await page.mouse.wheel(0, 1200);
    await expect(page.getByRole('heading', { name: 'New Mexico' })).toBeVisible();
  });

  test('does not introduce horizontal overflow when resized below md', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/photography');
    await waitForPhotographySection(page);

    await page.setViewportSize({ width: 700, height: 1200 });
    await page.waitForFunction(() => document.documentElement.scrollWidth <= window.innerWidth);

    const viewportMetrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(viewportMetrics.scrollWidth).toBeLessThanOrEqual(viewportMetrics.innerWidth);
  });

  test('navigates to a category via slug', async ({ page }) => {
    await page.goto('/photography/landscape');
    await expect(page.getByRole('heading', { name: 'Landscape', exact: true })).toBeVisible();
    await expect(page.getByText('Landscape photo collection')).toBeVisible();

    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'auto' }));
    await expect(page.getByRole('button', { name: 'Back to top' })).toBeVisible();

    await page.getByRole('button', { name: 'Back to top' }).click();
    await page.waitForFunction(() => window.scrollY === 0);
    await expect(page.getByRole('button', { name: 'Back to top' })).toHaveCount(0);
  });

  test('offers contextual recovery for invalid album slugs', async ({ page }) => {
    await page.goto('/photography/landscap');

    await expect(page.getByRole('link', { name: 'Back to photography' })).toBeVisible();
    await expect(page.getByText('Album not found')).toBeVisible();
    await page.getByRole('button', { name: 'Open command palette' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(1);
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('textbox', { name: 'Search routes, albums, and CV sections' })
    ).toHaveValue('landscap');
    const landscapeAction = dialog.getByRole('button', { name: /Album: Landscape/ });
    await expect(landscapeAction).toBeVisible();

    await landscapeAction.click();
    await expect(page).toHaveURL(/\/photography\/landscape$/);
    await expect(page.getByRole('heading', { name: 'Landscape', exact: true })).toBeVisible();
  });

  test('redirects legacy slugs to the canonical album path', async ({ page }) => {
    await page.goto('/photography/new%20mexico');
    await expect(page).toHaveURL(/\/photography\/new-mexico$/);
    await expect(page.getByRole('heading', { name: 'New Mexico', exact: true })).toBeVisible();
  });
});
