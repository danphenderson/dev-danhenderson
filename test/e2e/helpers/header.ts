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

export const dismissWelcomeSequence = async (page: Page) => {
  const welcome = page.getByRole('region', { name: 'Make yourself at home' });
  await expect(welcome).toBeVisible();
  await welcome.getByRole('button', { name: 'Explore now' }).click();
  await expect(welcome).toBeHidden();
};
