import { test, expect, type Page } from '@playwright/test';

const waitForPhotographyCards = async (page: Page) => {
  await expect(page.getByRole('heading', { name: 'Collections' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View album' })).toHaveCount(4);
  await expect(page.getByRole('status', { name: 'Loading photography albums' })).toHaveCount(0);
};

test.describe('Photography page', () => {
  test('renders category cards', async ({ page }) => {
    await page.goto('/photography');
    await waitForPhotographyCards(page);
    await expect(page.getByRole('heading', { name: 'Landscape' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Action' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronomy' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New Mexico' })).toBeVisible();
  });

  test('does not introduce horizontal overflow when resized below md', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto('/photography');
    await waitForPhotographyCards(page);

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
});
