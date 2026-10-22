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

/** Home is available immediately; existing route tests share this readiness check. */
export const dismissWelcomeSequence = async (page: Page) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Daniel Henderson' })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Play welcome audio?' })).toHaveCount(0);
};
