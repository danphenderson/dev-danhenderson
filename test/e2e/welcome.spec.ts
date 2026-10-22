import { expect, test, type Page } from '@playwright/test';

const welcome = (page: Page) => page.getByRole('region', { name: 'Make yourself at home' });

test.describe('Unobstructed home entry', () => {
  test('continues unattended without requesting audio and skips the panel on reload', async ({
    page,
  }) => {
    const audioRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('soundcloud.com')) audioRequests.push(request.url());
    });
    await page.goto('/');
    await expect(welcome(page)).toBeVisible();
    await expect(welcome(page)).toBeHidden({ timeout: 8000 });
    await expect(page.getByTestId('home-ide-expanded')).toBeVisible();
    expect(audioRequests).toEqual([]);
    expect(
      await page.evaluate(() => localStorage.getItem('danhenderson-welcome-audio-consent'))
    ).not.toBe('granted');
    await page.reload();
    await expect(page.getByTestId('terminal-hero')).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
  });

  for (const { width, navigate } of [
    {
      width: 1440,
      navigate: (page: Page) => page.getByRole('link', { name: 'Go to CV', exact: true }).click(),
    },
    {
      width: 390,
      navigate: async (page: Page) => {
        await page.getByRole('button', { name: 'Open navigation menu' }).click();
        await page.getByRole('menuitem', { name: 'CV', exact: true }).click();
      },
    },
  ]) {
    test(`header navigation is usable during the welcome at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await expect(welcome(page)).toBeVisible();
      await navigate(page);
      await expect(page).toHaveURL(/\/cv$/);
      await expect(
        page.getByRole('heading', { name: 'Daniel Henderson', exact: true })
      ).toBeVisible();
      await expect(welcome(page)).toHaveCount(0);
    });
  }

  test('keeps focused controls available and returns focus to settings after Escape', async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto('/');
    await welcome(page).getByRole('button', { name: 'Off', exact: true }).focus();
    await page.clock.runFor(10000);
    await expect(welcome(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(welcome(page)).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open settings' })).toBeFocused();
  });

  test('settings remains accessible while the welcome is open', async ({ page }) => {
    await page.goto('/');
    await expect(welcome(page)).toBeVisible();
    await page.getByRole('button', { name: 'Open settings' }).click();
    await expect(page.getByTestId('settings-popover-content')).toBeVisible();
    await expect(welcome(page)).toBeHidden();
    await expect(page.getByRole('button', { name: 'Play welcome audio' })).toBeVisible();
  });

  for (const { preference, configure } of [
    {
      preference: 'off',
      configure: (page: Page) =>
        page.addInitScript(() => localStorage.setItem('danhenderson-motion', 'off')),
    },
    {
      preference: 'reduced',
      configure: (page: Page) => page.emulateMedia({ reducedMotion: 'reduce' }),
    },
  ]) {
    test(`enters the IDE with ${preference} motion`, async ({ page }) => {
      await configure(page);
      await page.goto('/');
      await expect(welcome(page)).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('home-ide-expanded')).toBeVisible({ timeout: 2000 });
      await expect(welcome(page)).toBeHidden();
    });
  }

  test('audio failure does not block entry and can be retried from settings', async ({ page }) => {
    await page.route('https://w.soundcloud.com/player/api.js', (route) => route.abort());
    await page.goto('/');
    await welcome(page).getByRole('button', { name: 'Play welcome audio' }).click();
    await expect(welcome(page).getByText(/Unable to (play|load) welcome audio\./)).toBeVisible();
    await welcome(page).getByRole('button', { name: 'Explore now' }).click();
    await expect(welcome(page)).toBeHidden();
    await expect(page.getByTestId('terminal-hero')).toBeVisible();
    await page.getByRole('button', { name: 'Open settings' }).click();
    await expect(page.getByRole('button', { name: 'Play welcome audio' })).toBeEnabled();
  });
});
