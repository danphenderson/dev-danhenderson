import { test, expect } from '@playwright/test';
import { mockGitHubAPISuccess, mockGitHubAPIFailure } from './helpers/github';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('CV page – GitHub integration', () => {
  test('renders the CV page with core sections', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.getByText('Daniel Henderson')).toBeVisible();
    await expect(page.getByText('Software Engineer')).toBeVisible();
  });

  test('displays mocked GitHub activity when API succeeds', async ({ page }) => {
    await mockGitHubAPISuccess(page);
    await page.goto('/cv');

    const main = page.locator('main');

    // The mocked push event should render as formatted activity text
    await expect(
      main.getByText(/Pushed 1 commit to danphenderson\/dev-danhenderson/),
    ).toBeVisible();

    // The GitHub section headings should render
    await expect(main.getByText('Recent Activity')).toBeVisible();
  });

  test('falls back gracefully when GitHub API fails', async ({ page }) => {
    await mockGitHubAPIFailure(page);
    await page.goto('/cv');

    const main = page.locator('main');

    // Fallback activity items should still appear
    await expect(
      main.getByText(/Maintaining BlockOpt\.jl/i),
    ).toBeVisible();

    // Fallback contributions should appear (unique to contributions section)
    await expect(main.getByText(/dbt-labs\/dbt-core/)).toBeVisible();

    // The GitHub section headings should render
    await expect(main.getByText('Recent Activity')).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Contributions' })).toBeVisible();
  });
});
