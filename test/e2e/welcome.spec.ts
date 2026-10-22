import { expect, test, type Page } from '@playwright/test';

const welcome = (page: Page) => page.getByRole('region', { name: 'Make yourself at home' });
const openPreferences = async (page: Page) => {
  await page.getByRole('button', { name: 'Customize appearance & audio' }).click();
  await expect(welcome(page)).toBeVisible();
};

test.describe('Unobstructed home entry', () => {
  test('continues unattended without requesting audio and skips the panel on reload', async ({
    page,
  }) => {
    const audioRequests: string[] = [];
    page.on('request', (request) => {
      try {
        const url = request.url();
        const { hostname } = new URL(url);
        if (hostname === 'soundcloud.com' || hostname.endsWith('.soundcloud.com')) {
          audioRequests.push(url);
        }
      } catch {
        // Ignore malformed or non-standard URLs in request tracking.
      }
    });
    await page.goto('/');
    await openPreferences(page);
    await expect(welcome(page)).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(welcome(page)).toBeHidden({ timeout: 8000 });
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
    test(`header navigation is usable during the welcome at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await openPreferences(page);
      await expect(welcome(page)).toBeVisible();
      await navigate(page);
      await expect(page).toHaveURL(/\/cv$/);
      await expect(
        page.getByRole('heading', { name: 'Daniel Henderson', exact: true })
      ).toBeVisible();
      await expect(welcome(page)).toHaveCount(0);
    });
  }

  test('keeps focused controls available and returns focus to its opener after Escape', async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto('/');
    await openPreferences(page);
    await welcome(page).getByRole('button', { name: 'Off', exact: true }).focus();
    await expect(page.getByRole('button', { name: 'Off', exact: true })).toBeFocused();
    await expect(page.getByText('Take your time — this stays open while you choose.')).toBeVisible();
    await page.clock.runFor(10000);
    await expect(welcome(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(welcome(page)).toBeHidden();
    await expect(page.getByRole('button', { name: 'Customize appearance & audio' })).toBeFocused();
  });

  test('settings remains accessible while the welcome is open', async ({ page }) => {
    await page.goto('/');
    await openPreferences(page);
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
      await openPreferences(page);
      await expect(welcome(page)).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('terminal-hero')).toBeVisible({ timeout: 2000 });
      await expect(page.getByTestId('home-ide-expanded')).toHaveCount(0);
      await expect(welcome(page)).toBeHidden();
    });
  }

  test('audio failure does not block entry and can be retried from settings', async ({ page }) => {
    let scriptRequests = 0;
    await page.route('https://w.soundcloud.com/player/?*', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<html></html>' })
    );
    await page.route('https://w.soundcloud.com/player/api.js', (route) => {
      scriptRequests += 1;
      if (scriptRequests === 1) return route.abort();
      return route.fulfill({
        contentType: 'application/javascript',
        body: `window.SC = { Widget: function () {
          const listeners = {};
          return {
            bind: (event, listener) => {
              listeners[event] = listener;
              if (event === 'ready') setTimeout(listener, 0);
            },
            unbind: (event) => { delete listeners[event]; },
            play: () => listeners.play?.(),
            pause: () => listeners.pause?.(),
            isPaused: (callback) => callback(true),
            setLoop: () => {},
          };
        } };`,
      });
    });
    await page.goto('/');
    await openPreferences(page);
    await welcome(page).getByRole('button', { name: 'Play welcome audio' }).click();
    await expect(welcome(page).getByText(/Unable to (play|load) welcome audio\./)).toBeVisible();
    await welcome(page).getByRole('button', { name: 'Explore now' }).click();
    await expect(welcome(page)).toBeHidden();
    await expect(page.getByTestId('terminal-hero')).toBeVisible();
    await page.getByRole('button', { name: 'Open settings' }).click();
    await page.getByRole('button', { name: 'Play welcome audio' }).click();
    await expect(page.getByRole('button', { name: 'Pause welcome audio' })).toBeVisible();
    expect(scriptRequests).toBe(2);
    await page.getByRole('button', { name: 'Pause welcome audio' }).click();
    await expect(page.getByRole('button', { name: 'Play welcome audio' })).toBeVisible();
  });
});
