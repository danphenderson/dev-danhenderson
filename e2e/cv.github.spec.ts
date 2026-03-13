import { test, expect, type Locator, type Page } from '@playwright/test';
import { mockGitHubAPISuccess, mockGitHubAPIFailure } from './helpers/github';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

const COMMON_LINK_TOOLTIP_ID = 'common-link-tooltip';

const expectCommonLinkTooltip = async (
  page: Page,
  link: Locator,
  content: string,
) => {
  const tooltip = page.locator(`#${COMMON_LINK_TOOLTIP_ID}`);

  await link.scrollIntoViewIfNeeded();
  await expect(link).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
  await expect(link).toHaveAttribute('data-tooltip-content', content);
  await link.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText(content);
};

test.describe('CV page – GitHub integration', () => {
  test('renders the CV page with core sections', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.getByText('Daniel Henderson')).toBeVisible();
    await expect(page.getByText('Software Engineer')).toBeVisible();

    const programLink = page.getByRole('link', {
      name: 'M.S. Mathematics student in the applied/computational track (expected Aug 2026)',
    });
    const advisorLink = page.getByRole('link', { name: 'Jiguang Sun' });
    const mtuOrganizationLink = page.getByRole('link', { name: 'Michigan Technological University' }).first();
    const littleBrothersLink = page.getByRole('link', { name: 'Little Brothers' });

    await expect(programLink).toHaveAttribute('href', 'https://www.mtu.edu/math/graduate/students/');
    await expectCommonLinkTooltip(
      page,
      programLink,
      'View the Michigan Tech graduate mathematics student page.',
    );
    await expectCommonLinkTooltip(page, advisorLink, 'View faculty page');
    await expect(mtuOrganizationLink).toHaveAttribute(
      'href',
      'https://www.mtu.edu/globalcampus/programs/degrees/?deliveryOption=online&tags=grad'
    );
    await expectCommonLinkTooltip(page, mtuOrganizationLink, 'View online graduate degrees page');
    await expect(littleBrothersLink).toHaveAttribute('href', 'https://lbfenetwork.org');
    await expectCommonLinkTooltip(page, littleBrothersLink, 'View organization site');

    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'auto' }));

    const sectionNavFab = page.getByRole('button', { name: 'CV section navigation' });
    await expect(sectionNavFab).toBeVisible();

    await sectionNavFab.hover();
    await page.getByRole('menuitem', { name: 'Back to top' }).click();
    await page.waitForFunction(() => window.scrollY === 0);
    await expect(sectionNavFab).toHaveCount(0);
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
    await expect(main.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
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
    await expect(main.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Contributions' })).toBeVisible();
  });
});
