import { expect, type Page } from '@playwright/test';

export const resetWelcomeState = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
};

export const declineWelcomeAudio = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');
    window.localStorage.setItem('danhenderson-onboarding-completed', 'true');
  });
};

export const expectImmediateHome = async (page: Page) => {
  await expect(page.getByRole('link', { name: 'Explore my CV' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Make yourself at home' })).toHaveCount(0);
};
