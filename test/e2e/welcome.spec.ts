import { expect, test, type Page } from '@playwright/test';

const welcome = (page: Page) => page.getByRole('region', { name: 'Make yourself at home' });

test.describe('Unobstructed home entry', () => {
  test('continues unattended without requesting audio and skips the panel on reload', async ({
    page,
  }) => {
    const audioRequests: string[] = [];
    page.on('request', (request) => {
      try {
        const url = request.url();
        const { hostname, pathname } = new URL(url);
        if (
          hostname === 'soundcloud.com' ||
          hostname.endsWith('.soundcloud.com') ||
          pathname.endsWith('/assets/verse.mp3')
        ) {
          audioRequests.push(url);
        }
      } catch {
        // Ignore malformed or non-standard URLs in request tracking.
      }
    });
    await page.goto('/');
    await expect(welcome(page)).toHaveCount(0);
    await expect(page.getByTestId('terminal-hero')).toBeVisible();
    await expect(page.getByTestId('home-ide-expanded')).toHaveCount(0);
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
    test(`header navigation is usable on entry at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await expect(welcome(page)).toHaveCount(0);
      await navigate(page);
      await expect(page).toHaveURL(/\/cv$/);
      await expect(
        page.getByRole('heading', { name: 'Daniel Henderson', exact: true })
      ).toBeVisible();
      await expect(welcome(page)).toHaveCount(0);
    });
  }

  test('settings keeps appearance and audio controls accessible', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await expect(page.getByTestId('settings-popover-content')).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Appearance presets' })).toBeVisible();
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
      await expect(welcome(page)).toHaveCount(0);
      await expect(page.getByTestId('terminal-hero')).toBeVisible({ timeout: 2000 });
      await expect(page.getByTestId('home-ide-expanded')).toHaveCount(0);
      await expect(welcome(page)).toBeHidden();
    });
  }

  test('audio failure is visible and can be retried from settings', async ({ page }) => {
    let failAudio = true;
    await page.route('**/assets/verse.mp3', (route) =>
      failAudio
        ? route.fulfill({ status: 404, contentType: 'text/plain', body: 'Unavailable' })
        : route.continue()
    );
    await page.goto('/');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('button', { name: 'Play welcome audio' }).click();
    await expect(page.getByRole('alert')).toHaveText('Audio could not start. Please try again.');
    await expect(page.getByTestId('terminal-hero')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Play welcome audio' })).toBeEnabled();

    failAudio = false;
    await page.getByRole('button', { name: 'Play welcome audio' }).click();
    await expect(page.getByRole('button', { name: 'Pause welcome audio' })).toBeVisible();
    await expect
      .poll(() =>
        page.getByTestId('welcome-audio').evaluate((audio: HTMLAudioElement) => audio.currentTime)
      )
      .toBeGreaterThan(0);
    await expect(page.getByRole('alert')).toHaveCount(0);
    await page.getByRole('button', { name: 'Pause welcome audio' }).click();
    await expect(page.getByRole('button', { name: 'Play welcome audio' })).toBeVisible();
  });

  test('playback survives client navigation but reload remains paused with stored consent', async ({
    page,
  }) => {
    await page.goto('/');
    const audio = page.getByTestId('welcome-audio');
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('button', { name: 'Play welcome audio' }).click();
    await expect(page.getByRole('button', { name: 'Pause welcome audio' })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('link', { name: 'Go to Photography', exact: true }).click();
    await expect(page).toHaveURL(/\/photography$/);
    await expect
      .poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused))
      .toBe(false);
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('button', { name: 'Pause welcome audio' }).click();
    await expect
      .poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused))
      .toBe(true);
    const position = await audio.evaluate((element: HTMLAudioElement) => element.currentTime);
    await page.getByRole('button', { name: 'Play welcome audio' }).click();
    await expect
      .poll(() => audio.evaluate((element: HTMLAudioElement) => element.currentTime))
      .toBeGreaterThan(position);

    await page.reload();
    await expect(audio).not.toHaveAttribute('src');
    await expect
      .poll(() => audio.evaluate((element: HTMLAudioElement) => element.paused))
      .toBe(true);
    expect(
      await page.evaluate(() => localStorage.getItem('danhenderson-welcome-audio-consent'))
    ).toBe('granted');
  });
});
