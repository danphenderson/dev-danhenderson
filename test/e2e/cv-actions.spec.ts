import { expect, test } from '@playwright/test';
import { mockGitHubAPIFailure, mockGitHubAPISuccess } from './helpers/github';

test('CV actions retain their links, keyboard access, and resume download', async ({ page }) => {
  await mockGitHubAPIFailure(page);
  await page.goto('/cv');
  const about = page.locator('#cv-about');
  await expect(about.getByRole('link', { name: 'Download resume', exact: true })).toHaveCount(0);
  const trigger = about.getByRole('button', { name: 'Open about actions' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(about.getByRole('menuitem', { name: 'Download Resume' })).toHaveAttribute(
    'download',
    'Daniel-Henderson-Resume.pdf'
  );
  await page.keyboard.press('ArrowLeft');
  const github = about.getByRole('menuitem', { name: 'GitHub', exact: true });
  await expect(github).toBeFocused();
  // Moving the mouse away must not dismiss the menu being used by keyboard.
  await github.hover();
  await page.mouse.move(0, 0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(github).toBeFocused();
  await expect(github).toHaveAttribute('href', 'https://github.com/danphenderson');
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(about.getByRole('menuitem', { name: 'LinkedIn' })).toHaveAttribute(
    'target',
    '_blank'
  );
  await expect(about.getByRole('menuitem', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:me@danhenderson.dev'
  );
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  const downloadEvent = page.waitForEvent('download');
  await about.getByRole('menuitem', { name: 'Download Resume' }).click();
  const download = await downloadEvent;
  // Static hosts may supply the lowercase asset name in Content-Disposition.
  expect(download.suggestedFilename().toLowerCase()).toBe('daniel-henderson-resume.pdf');
  expect(await download.failure()).toBeNull();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('section-navigation callback scrolls to the selected section and closes', async ({ page }) => {
  await mockGitHubAPIFailure(page);
  await page.goto('/cv');
  await expect(page.getByRole('heading', { name: 'Daniel Henderson', exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 1000));
  const trigger = page.getByRole('button', { name: 'CV section navigation' });
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Certificates', exact: true }).click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#cv-certificates')).toBeInViewport();
});

test('contribution chips display verified repository stars', async ({ page }) => {
  await mockGitHubAPISuccess(page);
  await page.goto('/cv#cv-github');
  const contribution = page
    .locator('#cv-github')
    .getByRole('link', { name: /microsoft\/playwright/ });
  await expect(contribution).toContainText('★ 50,000');
  await expect(contribution.getByLabel('50,000 GitHub stars')).toBeVisible();
});

test('fallback contributions do not claim zero stars when GitHub is unavailable', async ({
  page,
}) => {
  await mockGitHubAPIFailure(page);
  await page.goto('/cv#cv-github');
  const contribution = page
    .locator('#cv-github')
    .getByRole('link', { name: /microsoft\/playwright/ });
  await expect(contribution).toContainText('★ —');
  await expect(contribution.getByLabel('Star count unavailable')).toBeVisible();
});

test('experience details clear their backdrop when keyboard focus moves to another role', async ({
  page,
}) => {
  await mockGitHubAPIFailure(page);
  await page.goto('/cv#cv-experience');
  const researchTabs = page.getByRole('tablist', {
    name: 'Graduate Research Assistant supplemental information',
  });
  const highlights = researchTabs.getByRole('tab', { name: 'Highlights' });
  const backdrop = page.getByTestId('experience-section-backdrop');

  await highlights.click();
  await expect(highlights).toHaveAttribute('aria-selected', 'true');
  await expect(backdrop).toHaveAttribute('data-active', 'true');

  // Moving within the active role preserves the detail; leaving it clears the blur.
  await highlights.press('ArrowRight');
  await expect(researchTabs.getByRole('tab', { name: 'Skills' })).toBeFocused();
  await expect(backdrop).toHaveAttribute('data-active', 'true');
  await page.keyboard.press('Tab');

  await expect(page.locator('#cv-experience a:focus')).toHaveText(
    'Michigan Technological University'
  );
  await expect(backdrop).toHaveAttribute('data-active', 'false');
});

for (const { motionPreference, motion, reducedMotion } of [
  { motionPreference: 'off', motion: 'off', reducedMotion: 'no-preference' },
  { motionPreference: 'reduced', motion: 'default', reducedMotion: 'reduce' },
] as const) {
  test(`mobile CV deep links reveal experience cards with ${motionPreference} motion`, async ({
    page,
  }) => {
    await mockGitHubAPIFailure(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion });
    await page.addInitScript(
      (preference) => localStorage.setItem('danhenderson-motion', preference),
      motion
    );

    await page.goto('/cv#cv-experience');

    const experience = page.locator('#cv-experience');
    await expect(experience.getByRole('heading', { name: 'Expert Contributor' })).toBeVisible();
    await expect(experience.getByText('Snorkel AI', { exact: true })).toBeVisible();
    await expect(experience.getByText('Jun 2026 – Present', { exact: true })).toBeVisible();
    await expect(
      experience.getByRole('heading', { name: 'Graduate Research Assistant', exact: true })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Stack:' })).toBeVisible();
  });
}
