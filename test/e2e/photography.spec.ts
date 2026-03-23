import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

const PHOTOGRAPHY_NOT_FOUND_COPY =
  /This album does not exist or has been moved\. The command palette opens with a recovery search so you can jump to another gallery or route quickly\./;
const INVALID_PHOTOGRAPHY_SLUG_QUERY = 'landscap';

const waitForPhotographyCategoryPage = async (page: Page, name: string, description?: string) => {
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('link', { name: 'Back to photography' })).toBeVisible();
  await expect(page.getByRole('list', { name: `${name} photo gallery` })).toBeVisible({
    timeout: 15000,
  });

  if (description) {
    await expect(page.getByText(description)).toBeVisible({ timeout: 15000 });
  }
};

const waitForPhotographySection = async (page: Page) => {
  await waitForAnimatedSectionReadiness({
    anchor: page.getByText('A selection of field work, climbing days, and stargazing nights.'),
    readyLocators: [page.getByText('4 albums')],
    hiddenLocators: [page.getByRole('status', { name: 'Loading photography albums' })],
  });
};

const waitForPhotographyFallback = async (page: Page) => {
  const main = page.locator('main');

  await waitForAnimatedSectionReadiness({
    anchor: main.getByRole('heading', { name: 'Album not found' }),
    readyLocators: [
      main.getByRole('link', { name: 'Back to photography' }),
      main.getByText(/^Photography album$/),
      main.getByText(PHOTOGRAPHY_NOT_FOUND_COPY),
      main.getByRole('heading', { name: 'Suggested destinations' }),
      main.getByRole('heading', { name: 'Shared recovery routes' }),
      main.getByRole('link', { name: 'Open Album: Landscape' }),
    ],
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
    await expect(
      page.getByText('A selection of field work, climbing days, and stargazing nights.')
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('4 albums')).toBeVisible({ timeout: 15000 });

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
    await waitForPhotographyCategoryPage(page, 'Landscape', 'Landscape photo collection');

    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'auto' }));
    await expect(page.getByRole('button', { name: 'Back to top' })).toBeVisible();

    await page.getByRole('button', { name: 'Back to top' }).click();
    await page.waitForFunction(() => window.scrollY === 0);
    await expect(page.getByRole('button', { name: 'Back to top' })).toHaveCount(0);
  });

  test('offers contextual recovery for invalid album slugs', async ({ page }) => {
    await page.goto('/photography/landscap');

    await waitForPhotographyFallback(page);

    await page.getByRole('button', { name: 'Open command palette' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(1);
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('combobox', { name: 'Search routes, albums, and CV sections' })
    ).toHaveValue(INVALID_PHOTOGRAPHY_SLUG_QUERY);
    const landscapeAction = dialog.getByRole('option', { name: /Album: Landscape/ });
    await expect(landscapeAction).toBeVisible();

    await landscapeAction.click();
    await expect(page).toHaveURL(/\/photography\/landscape$/);
    await waitForPhotographyCategoryPage(page, 'Landscape', 'Landscape photo collection');
    await expect(dialog).toBeHidden();
  });

  test('redirects legacy slugs to the canonical album path', async ({ page }) => {
    await page.goto('/photography/new%20mexico');
    await expect(page).toHaveURL(/\/photography\/new-mexico$/);
    await waitForPhotographyCategoryPage(page, 'New Mexico', 'New Mexico in November.');
  });
});
