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
  const dialog = page.getByRole('dialog', { name: 'Play welcome audio?' });

  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'No thanks' }).click();
  await expect(dialog).toBeHidden();

  const customizeDialog = page.getByTestId('customize-experience-dialog');
  await expect(customizeDialog).toBeVisible();
  await customizeDialog.getByRole('button', { name: 'Okay' }).click();
  await expect(customizeDialog).toBeHidden();

  const settingsHint = page.getByTestId('first-visit-settings-hint-popover');
  await expect(settingsHint).toBeVisible();
  await settingsHint.getByRole('button', { name: 'Get started' }).click();
  await expect(settingsHint).toBeHidden();
};
