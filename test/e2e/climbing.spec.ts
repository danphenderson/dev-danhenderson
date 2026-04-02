import { test, expect, type Page } from '@playwright/test';
import { waitForClimbingContent, waitForClimbingIntro } from './helpers/climbing';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

test.describe('Climbing page', () => {
  test('shows only the climbing intro until scrolling unlocks the deferred content', async ({
    page,
  }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingIntro(page);

    await expect(main.getByText('Climbing', { exact: true }).first()).toBeVisible();
    await expect(
      main.getByText(
        /A collection of ascents that were recorded on Mountain Project, including everything from the rare onsights to noteworthy top-ropes\./
      )
    ).toBeVisible();
    await expect(main.getByTestId('climbing-scroll-unlock-runway')).toBeVisible();
    await expect(main.getByText('Routes Climbed', { exact: true })).toHaveCount(0);
    await expect(main.getByRole('table')).toHaveCount(0);
  });

  test('renders climbing route tables and inline route links', async ({ page }) => {
    await page.goto('/climbing');
    const { main, firstRouteLink, routesToClimbIntro } = await waitForClimbingContent(page);

    await expect(
      main.getByText(
        /A collection of ascents that were recorded on Mountain Project, including everything from the rare onsights to noteworthy top-ropes\./
      )
    ).toBeVisible();
    await expect(routesToClimbIntro).toBeVisible();
    await expect(firstRouteLink).toBeVisible();
    await expect(firstRouteLink).toHaveAttribute('href', /mountainproject\.com\/route\//);
    await expect(firstRouteLink).toHaveAttribute(
      'data-tooltip-content',
      /Open .* on Mountain Project\./
    );
  });

  test('renders analytics overview section', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingContent(page);

    await expect(main.getByText('Routes Climbed', { exact: true })).toBeVisible();
    await expect(main.getByText('Routes to Climb', { exact: true }).first()).toBeVisible();
    await expect(main.getByText('Unique Locations', { exact: true })).toBeVisible();
    await expect(main.getByText('Most Recent Tick')).toBeVisible();
  });

  test('renders grade profile section', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingContent(page);

    await expect(main.getByText('Grade Profile')).toBeVisible();
    await expect(main.getByText('Climbed', { exact: true })).toBeVisible();
    await expect(main.getByText('To Climb', { exact: true })).toBeVisible();
    await expect(main.getByText(/\d+\.\d+ \(\d+\)/).first()).toBeVisible();
  });

  test('renders destination profile section', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingContent(page);

    await expect(main.getByText('Top Destinations')).toBeVisible();
    await expect(main.getByText('Most Climbed')).toBeVisible();
    await expect(main.getByText('Most Wanted')).toBeVisible();
  });

  test('renders data freshness indicator', async ({ page }) => {
    await page.goto('/climbing');
    const { main } = await waitForClimbingContent(page);

    await expect(main.getByText(/Bundled climbing log updated through/)).toBeVisible();
  });
});
