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

    // The mocked push event should render as formatted activity text
    await expect(
      page.getByText(/Pushed 1 commit to danphenderson\/dev-danhenderson/),
    ).toBeVisible();

    // The mocked project should render
    await expect(
      page.getByText('BlockOpt.jl').first(),
    ).toBeVisible();
  });

  test('falls back gracefully when GitHub API fails', async ({ page }) => {
    await mockGitHubAPIFailure(page);
    await page.goto('/cv');

    // Fallback activity items should still appear
    await expect(
      page.getByText(/Maintaining BlockOpt\.jl/i),
    ).toBeVisible();

    // Fallback projects should appear
    await expect(
      page.getByText('BlockOpt.jl').first(),
    ).toBeVisible();

    // Fallback contributions should appear
    await expect(
      page.getByText('microsoft/playwright').first(),
    ).toBeVisible();
  });
});
