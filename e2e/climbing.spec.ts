import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Climbing page', () => {
  test('renders climbing route tables', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(
      main.getByText("A collection of routes I've remembered to tick on Mountain Project."),
    ).toBeVisible();
    await expect(main.getByText('TODO Routes')).toBeVisible();
  });

  test('renders analytics overview section', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText('Overview')).toBeVisible();
    await expect(main.getByText('Routes Climbed')).toBeVisible();
    await expect(main.getByText('Routes To Do')).toBeVisible();
    await expect(main.getByText('Unique Locations')).toBeVisible();
    await expect(main.getByText('Most Recent Tick')).toBeVisible();
  });

  test('renders grade profile section', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText('Grade Profile')).toBeVisible();
    // Should contain at least one grade chip
    await expect(main.locator('.MuiChip-root').first()).toBeVisible();
  });

  test('renders destination profile section', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText('Top Destinations')).toBeVisible();
    await expect(main.getByText('Most Climbed')).toBeVisible();
    await expect(main.getByText('Most Wanted')).toBeVisible();
  });

  test('renders data freshness indicator', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(main.getByText(/Tick data current through/)).toBeVisible();
  });
});
