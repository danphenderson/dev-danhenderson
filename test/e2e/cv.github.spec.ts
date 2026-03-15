import { test, expect, type Locator, type Page } from '@playwright/test';
import { mockGitHubAPISuccess, mockGitHubAPIFailure } from './helpers/github';

const COMMON_LINK_TOOLTIP_ID = 'common-link-tooltip';

/** Bring a lazily revealed CV section into the viewport so its animated content can become visible. */
const ensureCvSectionVisible = async (page: Page, sectionId: string) => {
  await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
};

const expectCommonLinkTooltip = async (page: Page, link: Locator, content: string) => {
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
    const mtuOrganizationLink = page
      .getByRole('link', { name: 'Michigan Technological University' })
      .first();
    // This volunteering link is mounted offscreen before its entrance animation finishes, so we
    // target its stable href and assert the persisted tooltip metadata after scrolling the section
    // into range instead of relying on an immediate visible role query.
    const littleBrothersLink = page.locator('main a[href="https://lbfenetwork.org"]').first();

    await expect(programLink).toHaveAttribute(
      'href',
      'https://www.mtu.edu/math/graduate/students/'
    );
    await expectCommonLinkTooltip(
      page,
      programLink,
      'View the Michigan Tech graduate mathematics student page.'
    );
    await ensureCvSectionVisible(page, 'cv-experience');
    await expect(advisorLink).toBeVisible();
    await expectCommonLinkTooltip(page, advisorLink, 'View faculty page');
    await expect(mtuOrganizationLink).toHaveAttribute(
      'href',
      'https://www.mtu.edu/globalcampus/programs/degrees/?deliveryOption=online&tags=grad'
    );
    await expectCommonLinkTooltip(page, mtuOrganizationLink, 'View online graduate degrees page');
    await ensureCvSectionVisible(page, 'cv-volunteering');
    await expect(littleBrothersLink).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    await expect(littleBrothersLink).toHaveAttribute(
      'data-tooltip-content',
      'View organization site'
    );

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
    await ensureCvSectionVisible(page, 'cv-github');

    const main = page.locator('main');

    // The mocked push event should render as formatted activity text
    await expect(
      main.getByText(/Pushed 1 commit to danphenderson\/dev-danhenderson/)
    ).toBeVisible();
    await expect(main.getByText('Data status')).toBeVisible();
    await expect(
      main.getByText('Showing live GitHub activity from the latest successful fetch.')
    ).toBeVisible();

    // The GitHub section headings should render
    await expect(main.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
  });

  test('falls back gracefully when GitHub API fails', async ({ page }) => {
    await mockGitHubAPIFailure(page);
    await page.goto('/cv');
    await ensureCvSectionVisible(page, 'cv-github');

    const main = page.locator('main');

    // Fallback activity items should still appear
    await expect(main.getByText(/Maintaining BlockOpt\.jl/i)).toBeVisible();

    // Fallback contributions should appear (unique to contributions section)
    await expect(main.getByText(/dbt-labs\/dbt-core/)).toBeVisible();
    await expect(
      main.getByText(
        'Showing bundled fallback highlights because the live GitHub response was incomplete or unavailable.'
      )
    ).toBeVisible();

    // The GitHub section headings should render
    await expect(main.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Contributions' })).toBeVisible();
  });
});
