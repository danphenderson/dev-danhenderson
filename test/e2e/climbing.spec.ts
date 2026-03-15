import { test, expect } from '@playwright/test';

test.describe('Climbing page', () => {
  test('renders climbing route tables and inline route links', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(
      main.getByText("A collection of routes I've remembered to tick on Mountain Project.")
    ).toHaveCount(1);
    await expect(main.getByText('TODO Routes')).toHaveCount(1);
    const routeLinks = main.locator('a[href*="mountainproject.com/route/"]');
    await expect(routeLinks.first()).toBeAttached();
    await expect(routeLinks.first()).toHaveAttribute('href', /mountainproject\.com\/route\//);
    await expect(routeLinks.first()).toHaveAttribute(
      'data-tooltip-content',
      /Open .* on Mountain Project\./
    );
  });

  test('renders analytics overview section', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText('Overview')).toHaveCount(1);
    await expect(main.getByText('Routes Climbed')).toHaveCount(1);
    await expect(main.getByText('Routes To Do')).toHaveCount(1);
    await expect(main.getByText('Unique Locations')).toHaveCount(1);
    await expect(main.getByText('Most Recent Tick')).toHaveCount(1);
  });

  test('renders grade profile section', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText('Grade Profile')).toHaveCount(1);
    await expect(main.locator('.MuiChip-root').first()).toBeAttached();
  });

  test('renders destination profile section', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText('Top Destinations')).toHaveCount(1);
    await expect(main.getByText('Most Climbed')).toHaveCount(1);
    await expect(main.getByText('Most Wanted')).toHaveCount(1);
  });

  test('renders data freshness indicator', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText(/Bundled climbing log updated through/)).toHaveCount(1);
  });
});
