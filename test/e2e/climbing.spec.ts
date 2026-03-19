import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

const waitForClimbingRoute = async (page: Page) => {
  const main = page.locator('main');
  const intro = main.getByText(
    /A collection of routes I've remembered to tick on Mountain Project, including some\s+top-rope ascents/
  );
  const firstRouteLink = main.locator('a[href*="mountainproject.com/route/"]').first();

  await waitForAnimatedSectionReadiness({
    anchor: intro,
    readyLocators: [main.getByText('Overview'), main.getByText('TODO Routes'), firstRouteLink],
  });

  return { main, firstRouteLink };
};

test.describe('Climbing page', () => {
  test('renders climbing route tables and inline route links', async ({ page }) => {
    await page.goto('/climbing');
    const { main, firstRouteLink } = await waitForClimbingRoute(page);

    await expect(
      main.getByText(
        /A collection of routes I've remembered to tick on Mountain Project, including some\s+top-rope ascents/
      )
    ).toBeVisible();
    await expect(main.getByText('TODO Routes')).toBeVisible();
    await expect(firstRouteLink).toBeVisible();
    await expect(firstRouteLink).toHaveAttribute('href', /mountainproject\.com\/route\//);
    await expect(firstRouteLink).toHaveAttribute(
      'data-tooltip-content',
      /Open .* on Mountain Project\./
    );
  });

  test('renders analytics overview section', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingRoute(page);

    await expect(main.getByText('Overview')).toBeVisible();
    await expect(main.getByText('Routes Climbed')).toBeVisible();
    await expect(main.getByText('Routes To Do')).toBeVisible();
    await expect(main.getByText('Unique Locations')).toBeVisible();
    await expect(main.getByText('Most Recent Tick')).toBeVisible();
  });

  test('renders grade profile section', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingRoute(page);

    await expect(main.getByText('Grade Profile')).toBeVisible();
    await expect(main.locator('.MuiChip-root').first()).toBeVisible();
  });

  test('renders destination profile section', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingRoute(page);

    await expect(main.getByText('Top Destinations')).toBeVisible();
    await expect(main.getByText('Most Climbed')).toBeVisible();
    await expect(main.getByText('Most Wanted')).toBeVisible();
  });

  test('renders data freshness indicator', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingRoute(page);

    await expect(main.getByText(/Bundled climbing log updated through/)).toBeVisible();
  });
});
