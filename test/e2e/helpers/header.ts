import { expect, type Page } from '@playwright/test';

export const HEADER_SETTINGS_HINT_TITLE = 'Customize your experience';
export const HEADER_SETTINGS_HINT_BODY =
  'Open settings to switch theme, change appearance, and adjust motion preferences.';

export const resetWelcomeState = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
};

export const declineWelcomeAudio = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');
  });
};

export const expectHeaderSettingsHint = async (page: Page) => {
  const hintTitle = page.getByText(HEADER_SETTINGS_HINT_TITLE, { exact: true });
  const hintBody = page.getByText(HEADER_SETTINGS_HINT_BODY, { exact: true });

  await expect(hintTitle).toBeVisible();
  await expect(hintBody).toBeVisible();
};

export const dismissHeaderSettingsHint = async (page: Page) => {
  await expectHeaderSettingsHint(page);

  await page.keyboard.press('Escape');

  await expect(page.getByText(HEADER_SETTINGS_HINT_TITLE, { exact: true })).toBeHidden();
};

export const dismissWelcomeSequence = async (page: Page) => {
  const dialog = page.getByRole('dialog', { name: 'Play welcome audio?' });

  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'No thanks' }).click();
  await expect(dialog).toBeHidden();

  await dismissHeaderSettingsHint(page);
};
