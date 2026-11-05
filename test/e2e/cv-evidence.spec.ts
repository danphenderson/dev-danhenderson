import { expect, test } from '@playwright/test';
import { mockGitHubAPIFailure } from './helpers/github';

test.beforeEach(async ({ page }) => {
  await mockGitHubAPIFailure(page);
});

test('story project Results include their complete source evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv?mode=story');
  const chapter = page.locator('[data-story-index]').filter({
    has: page.locator('h2').filter({ hasText: 'typewriter CLI' }),
  });
  await chapter.scrollIntoViewIfNeeded();
  await chapter.getByRole('tab', { name: 'Results', exact: true }).click();
  await expect(chapter.getByRole('link', { name: 'CLI regression examples' })).toBeVisible();
  await expect(chapter.getByRole('link', { name: 'transformation implementation' })).toBeVisible();
});

for (const motion of ['default', 'subtle', 'off']) {
  test(`entry navigation preserves ${motion} motion and supports keyboard, history, and repeat activation`, async ({
    page,
  }) => {
    await page.addInitScript((level) => localStorage.setItem('danhenderson-motion', level), motion);
    await page.goto('/cv');
    const python = page.locator('#cv-stack-python');
    await expect(python).toHaveAttribute('tabindex', '0');
    await expect(python.locator('.MuiChip-label')).toHaveCSS('text-decoration-line', 'none');
    await python.hover();
    await expect(python).toHaveCSS('text-decoration-line', 'none');
    await expect(python.locator('.MuiChip-label')).toHaveCSS('text-decoration-line', 'none');
    await python.focus();
    await expect(python.locator('.MuiChip-label')).toHaveCSS('text-decoration-line', 'none');
    await page.keyboard.press('Enter');
    const heading = page.locator('#cv-coding-typewriter-heading');
    const project = page.locator('#cv-coding-typewriter');
    await expect(heading).toBeFocused();
    await expect(heading).toBeInViewport();
    await expect(project.getByRole('tab', { name: 'Approach', exact: true })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await page.goBack();
    await expect(python).toBeFocused();
    await expect(python).toBeInViewport();
    await page.goForward();
    await expect(heading).toBeFocused();

    await project.getByRole('tab', { name: 'Results', exact: true }).click();
    await expect(project.getByRole('link', { name: 'CLI regression examples' })).toBeVisible();
    await python.click();
    await expect(heading).toBeFocused();
    await expect(project.getByRole('tab', { name: 'Approach', exact: true })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await page.goBack();
    await expect(page).toHaveURL(/\/cv$/);
    await expect(python).toBeFocused();
  });
}

test('copied links reload to the intended detail and preserve section navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv#cv-coding-portfolio');
  const heading = page.locator('#cv-coding-portfolio-heading');
  await expect(heading).toBeFocused();
  await page.reload();
  await expect(heading).toBeFocused();
  await expect(
    page.locator('#cv-coding-portfolio').getByRole('tab', { name: 'Approach', exact: true })
  ).toHaveAttribute('aria-selected', 'true');
  await page.goto('/cv#cv-experience-lucerna-data-pipeline');
  await expect(page.locator('#cv-experience-lucerna-data-pipeline-heading')).toBeFocused();
  const role = page.locator('#cv-experience-lucerna-data-pipeline');
  await expect(role.getByRole('tab', { name: 'Highlights', exact: true })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await expect(role.getByText(/PostgreSQL/).first()).toBeVisible();
  await page.goto('/cv#cv-certificates');
  await expect(page.locator('#cv-certificates')).toBeInViewport();
});

test('latest destination wins and explicit story mode remains authoritative', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('#cv-stack-react')).toHaveAttribute('tabindex', '0');
  // Dispatch two ordinary anchor activations in one turn, before either destination settles.
  await page.evaluate(() => {
    document.getElementById('cv-stack-react')!.click();
    document.getElementById('cv-stack-python')!.click();
  });
  await expect(page.locator('#cv-coding-typewriter-heading')).toBeFocused();
  await page.goto('/cv?mode=story#cv-coding-portfolio');
  await expect(page.getByRole('button', { name: 'Exit story mode' })).toBeVisible();
  await expect(page.locator('#cv-coding-portfolio-heading')).toHaveCount(0);
  await page.goto('/cv#unknown-evidence');
  await expect(page.getByRole('heading', { name: 'Daniel Henderson', exact: true })).toBeVisible();
  await expect(page.locator('#cv-stack-python')).toHaveAttribute(
    'href',
    '/cv#cv-coding-typewriter'
  );
});

test('a repeated destination after Back leaves the restored origin and refocuses its entry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv#cv-coding-typewriter');
  await expect(page.locator('#cv-coding-typewriter-heading')).toBeFocused();
  await page.locator('#cv-stack-react').click();
  await expect(page.locator('#cv-coding-portfolio-heading')).toBeFocused();
  await page.goBack();
  await expect(page.locator('#cv-stack-react')).toBeFocused();
  await page.locator('#cv-stack-python').click();
  await expect(page.locator('#cv-coding-typewriter-heading')).toBeFocused();
});

for (const width of [320, 390]) {
  test(`linked and plain Stack chips fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/cv');
    await expect(page.locator('#cv-stack-python')).toBeVisible();
    await expect(page.locator('#cv-about a[id^="cv-stack-"]')).toHaveCount(8);
    await expect(
      page.locator('#cv-about').getByText('Docker Compose', { exact: true })
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.locator('#cv-stack-postgres').click();
    await expect(page.locator('#cv-experience-lucerna-data-pipeline-heading')).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
  });
}
