import { test, expect, type Locator, type Page } from '@playwright/test';

const HOME_SCREENSHOT_CLOCK_START = new Date('2026-03-17T12:00:00.000Z');
const STABLE_TERMINAL_OUTPUT_COMMAND = 'npm run build';
const STABLE_TERMINAL_OUTPUT_TEXT = 'Compiled successfully in 2.4s';
const TERMINAL_NOTIFICATION_TEXT = 'server.py — No problems detected ✓';

const resetWelcomeState = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
};

const dismissWelcomeSequence = async (page: Page) => {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'No thanks' }).click();
  await expect(dialog).toBeHidden();

  const darkModeHint = page.getByText(/Try an alternative theme/i);
  await expect(darkModeHint).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(darkModeHint).toBeHidden();
};

const moveMouseAwayFromHero = async (page: Page) => {
  await page.mouse.move(4, 4);
  await page.waitForTimeout(250);
};

const getHeroLayoutWidth = async (terminalHero: Locator) =>
  terminalHero.evaluate((node) => (node as HTMLElement).offsetWidth);

const dismissTerminalNotificationToast = async (page: Page) => {
  const toast = page.getByText(TERMINAL_NOTIFICATION_TEXT);

  if (!(await toast.isVisible().catch(() => false))) {
    return;
  }

  await toast.locator('xpath=following-sibling::*[normalize-space()="×"]').click();
  await expect(toast).toBeHidden();
};

const waitForStableTerminalHero = async (page: Page, terminalHero: Locator) => {
  await expect(terminalHero).toContainText(STABLE_TERMINAL_OUTPUT_COMMAND, { timeout: 20000 });
  await expect(terminalHero).toContainText(STABLE_TERMINAL_OUTPUT_TEXT, { timeout: 20000 });
  await dismissTerminalNotificationToast(page);

  await moveMouseAwayFromHero(page);
};

const pausePageClock = async (page: Page) => {
  const currentTime = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(new Date(currentTime + 100));
};

test.describe('Home page', () => {
  test('renders the hero content after completing the welcome sequence', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await dismissWelcomeSequence(page);

    // The terminal hero shell should be visible with the typed content
    const terminalHero = page.getByTestId('terminal-hero');
    await expect(terminalHero).toBeVisible();

    // The terminal should type one of the commands and eventually show output
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|python --version|julia --version|brew ls/,
      { timeout: 20000 }
    );
    await expect(terminalHero).toContainText(
      /v22\.14\.0|9ab2238|Compiled successfully|mathematics|Python 3\.14|julia version|Formulae/,
      { timeout: 20000 }
    );
  });

  test('matches a stable screenshot for the default home terminal hero tab', async ({ page }) => {
    await resetWelcomeState(page);
    await page.clock.install({ time: HOME_SCREENSHOT_CLOCK_START });
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');

    await expect(terminalHero).toBeVisible();
    await terminalHero.scrollIntoViewIfNeeded();
    await expect(terminalHero).toContainText('Ping Pong Server', { timeout: 20000 });

    await waitForStableTerminalHero(page, terminalHero);
    await pausePageClock(page);

    await expect(terminalHero).toHaveScreenshot('home-terminal-server-tab.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    });
  });

  test('matches a stable screenshot for the client tab in the home terminal hero', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.clock.install({ time: HOME_SCREENSHOT_CLOCK_START });
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const clientTab = page.getByTestId('vscode-tab-client');

    await expect(terminalHero).toBeVisible();
    await terminalHero.scrollIntoViewIfNeeded();
    await expect(terminalHero).toContainText('Ping Pong Server', { timeout: 20000 });

    await waitForStableTerminalHero(page, terminalHero);

    await clientTab.click();
    await expect(terminalHero).toContainText('SERVER_URL');
    await moveMouseAwayFromHero(page);
    await pausePageClock(page);

    await expect(terminalHero).toHaveScreenshot('home-terminal-client-tab.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    });
  });

  test('allows dragging the hero window by the title bar within the home route', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const titleBar = page.getByTestId('vscode-title-bar');
    const mainRegion = page.locator('main').last();

    await expect(terminalHero).toBeVisible();
    await expect(titleBar).toBeVisible();
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|brew ls/,
      {
        timeout: 20000,
      }
    );

    const heroBefore = await terminalHero.boundingBox();
    const titleBarBox = await titleBar.boundingBox();
    const mainBox = await mainRegion.boundingBox();

    expect(heroBefore).not.toBeNull();
    expect(titleBarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    if (!heroBefore || !titleBarBox || !mainBox) {
      throw new Error('Expected hero, title bar, and main region bounding boxes to be available.');
    }

    const dragStartX = titleBarBox.x + 40;
    const dragStartY = titleBarBox.y + titleBarBox.height / 2;

    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragStartX + 120, dragStartY - 56, { steps: 12 });
    await page.mouse.up();

    const heroAfter = await terminalHero.boundingBox();

    expect(heroAfter).not.toBeNull();

    if (!heroAfter) {
      throw new Error('Expected the terminal hero bounding box after dragging.');
    }

    const xDelta = Math.abs(heroAfter.x - heroBefore.x);
    const yDelta = Math.abs(heroAfter.y - heroBefore.y);

    expect(xDelta + yDelta).toBeGreaterThan(40);
    expect(heroAfter.x).toBeGreaterThanOrEqual(mainBox.x - 1);
    expect(heroAfter.y).toBeGreaterThanOrEqual(mainBox.y - 1);
    expect(heroAfter.x + heroAfter.width).toBeLessThanOrEqual(mainBox.x + mainBox.width + 1);
    expect(heroAfter.y + heroAfter.height).toBeLessThanOrEqual(mainBox.y + mainBox.height + 1);
  });

  test('keeps the hero window width stable when switching editor tabs', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const serverTab = page.getByTestId('vscode-tab-server');
    const clientTab = page.getByTestId('vscode-tab-client');

    await expect(terminalHero).toBeVisible();
    await expect(serverTab).toBeVisible();
    await expect(clientTab).toBeVisible();
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|brew ls/,
      {
        timeout: 20000,
      }
    );
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|python --version|julia --version|brew ls/,
      { timeout: 20000 }
    );

    const initialWidth = await getHeroLayoutWidth(terminalHero);

    await clientTab.click();
    await expect(terminalHero).toContainText('SERVER_URL');

    const clientWidth = await getHeroLayoutWidth(terminalHero);

    await serverTab.click();
    await expect(terminalHero).toContainText('Ping Pong Server');

    const serverWidth = await getHeroLayoutWidth(terminalHero);

    expect(Math.abs(clientWidth - initialWidth)).toBeLessThanOrEqual(2);
    expect(Math.abs(serverWidth - initialWidth)).toBeLessThanOrEqual(2);
  });

  test('welcome audio prompt can be dismissed', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Play welcome audio?')).toBeVisible();
    await dialog.getByRole('button', { name: 'No thanks' }).click();
    await expect(dialog).toBeHidden();
  });
});
