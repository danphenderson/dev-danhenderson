import { expect, test } from '@playwright/test';
import { mockGitHubAPIFailure, mockGitHubAPISuccess } from './helpers/github';

test('CV actions retain their links, keyboard access, and resume download', async ({ page }) => {
  await mockGitHubAPIFailure(page);
  await page.goto('/cv');
  const trigger = page.getByRole('button', { name: 'Open about actions' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'Download Resume' })).toHaveAttribute(
    'download',
    'Daniel-Henderson-Resume.pdf'
  );
  await page.keyboard.press('ArrowLeft');
  const github = page.getByRole('menuitem', { name: 'GitHub', exact: true });
  await expect(github).toBeFocused();
  await expect(github).toHaveAttribute('href', 'https://github.com/danphenderson');
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByRole('menuitem', { name: 'LinkedIn' })).toHaveAttribute(
    'target',
    '_blank'
  );
  await expect(page.getByRole('menuitem', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:me@danhenderson.dev'
  );
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('menuitem', { name: 'Download Resume' }).click();
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
