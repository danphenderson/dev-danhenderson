import { test, expect, type Locator, type Page } from '@playwright/test';

const HOME_SCREENSHOT_CLOCK_START = new Date('2026-03-17T12:00:00.000Z');
const STABLE_TERMINAL_OUTPUT_COMMAND = 'npm run build';
const STABLE_TERMINAL_OUTPUT_TEXT = 'Compiled successfully in 2.4s';
const TERMINAL_NOTIFICATION_TEXT = 'server.py — No problems detected ✓';
const WELCOME_AUDIO_PROMPT_BODY =
  'Would you like to hear a short verse while browsing the site? Use the pause button in the header to stop it anytime.';
const HOME_HERO_SNAPSHOT_BOX = {
  width: 528,
  height: 439,
} as const;
const HOME_HERO_SCREENSHOT_OPTIONS = {
  animations: 'disabled' as const,
  caret: 'hide' as const,
  scale: 'css' as const,
  maxDiffPixelRatio: 0.05,
};

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
  await page.waitForTimeout(500);
};

const getElementLayoutWidth = async (element: Locator) =>
  element.evaluate((node) => (node as HTMLElement).offsetWidth);

const getElementLayoutHeight = async (element: Locator) =>
  element.evaluate((node) => (node as HTMLElement).offsetHeight);

const stabilizeHeroForScreenshot = async (terminalHero: Locator) => {
  await terminalHero.evaluate((node, size) => {
    const element = node as HTMLElement;
    element.style.boxSizing = 'border-box';
    element.style.width = `${size.width}px`;
    element.style.minWidth = `${size.width}px`;
    element.style.maxWidth = `${size.width}px`;
    element.style.height = `${size.height}px`;
    element.style.minHeight = `${size.height}px`;
    element.style.maxHeight = `${size.height}px`;
  }, HOME_HERO_SNAPSHOT_BOX);
};

const selectHeroEditorTab = async (terminalHero: Locator, tab: Locator, expectedText: string) => {
  await expect(tab).toBeVisible();
  await tab.scrollIntoViewIfNeeded();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await tab.click();

    if ((await tab.getAttribute('aria-selected')) === 'true') {
      await expect(terminalHero).toContainText(expectedText);
      return;
    }
  }

  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expect(terminalHero).toContainText(expectedText);
};

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

const resetHomeScrollForScreenshot = async (page: Page, terminalHero: Locator) => {
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await expect(terminalHero).toBeVisible();
};

test.describe('Home page', () => {
  test('renders the hero content after completing the welcome sequence', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    const welcomePrompt = page.getByRole('dialog', { name: 'Play welcome audio?' });
    await expect(welcomePrompt).toBeVisible();
    await expect(welcomePrompt).toContainText(WELCOME_AUDIO_PROMPT_BODY);

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
    await resetHomeScrollForScreenshot(page, terminalHero);
    await expect(terminalHero).toContainText('Ping Pong Server', { timeout: 20000 });

    await waitForStableTerminalHero(page, terminalHero);
    await stabilizeHeroForScreenshot(terminalHero);
    await pausePageClock(page);

    await expect(terminalHero).toHaveScreenshot(
      'home-terminal-server-tab.png',
      HOME_HERO_SCREENSHOT_OPTIONS
    );
  });

  test('switches to the client tab and shows client editor content in the home terminal hero', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.clock.install({ time: HOME_SCREENSHOT_CLOCK_START });
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const clientTab = terminalHero.getByTestId('vscode-tab-client');

    await expect(terminalHero).toBeVisible();
    await resetHomeScrollForScreenshot(page, terminalHero);
    await expect(terminalHero).toContainText('Ping Pong Server', { timeout: 20000 });

    await waitForStableTerminalHero(page, terminalHero);

    await selectHeroEditorTab(terminalHero, clientTab, 'SERVER_URL');
    await expect(terminalHero).toContainText('PingResponse');
    await expect(terminalHero).toContainText('client.ts');
  });

  test('traffic dots close the IDE and restore a fresh server session', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const clientTab = terminalHero.getByTestId('vscode-tab-client');
    const closeWindowButton = page.getByRole('button', { name: 'Close window' });
    const restoreWindowButton = page.getByRole('button', { name: 'Open Visual Studio Code' });

    await expect(terminalHero).toBeVisible();
    await waitForStableTerminalHero(page, terminalHero);

    await selectHeroEditorTab(terminalHero, clientTab, 'SERVER_URL');

    await closeWindowButton.click();
    await expect(page.getByTestId('terminal-hero')).toHaveCount(0);
    await expect(restoreWindowButton).toBeVisible();

    await restoreWindowButton.click();

    const restoredHero = page.getByTestId('terminal-hero');
    await expect(restoredHero).toBeVisible();
    await expect(restoredHero).toContainText('Ping Pong Server');
    await expect(restoredHero).not.toContainText('SERVER_URL');
  });

  test('traffic dots minimize the IDE and restore a fresh server session', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const clientTab = terminalHero.getByTestId('vscode-tab-client');
    const minimizeWindowButton = page.getByRole('button', { name: 'Minimize window' });
    const restoreMinimizedBar = page.getByRole('button', { name: 'Restore window' });

    await expect(terminalHero).toBeVisible();
    await waitForStableTerminalHero(page, terminalHero);

    await selectHeroEditorTab(terminalHero, clientTab, 'SERVER_URL');

    await minimizeWindowButton.click();
    await expect(page.getByTestId('terminal-hero')).toHaveCount(0);
    await expect(restoreMinimizedBar).toBeVisible();

    await restoreMinimizedBar.click();

    const restoredHero = page.getByTestId('terminal-hero');
    await expect(restoredHero).toBeVisible();
    await expect(restoredHero).toContainText('Ping Pong Server');
    await expect(restoredHero).not.toContainText('SERVER_URL');
  });

  test('expands the IDE within the visible page viewport and resizes the inner panes', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await dismissWelcomeSequence(page);

    const terminalHero = page.getByTestId('terminal-hero');
    const expandWindowButton = page.getByRole('button', { name: 'Expand window' });
    const expandedOverlay = page.getByTestId('home-ide-expanded');
    const mainContent = page.locator('#main-content');
    const header = page.locator('#site-navigation');
    const editorTabs = terminalHero.getByRole('tablist', { name: 'Editor tabs' });
    const terminalPanelBody = terminalHero.getByTestId('terminal-panel-body');

    await expect(terminalHero).toBeVisible();
    await expect(expandWindowButton).toBeVisible();
    await waitForStableTerminalHero(page, terminalHero);

    const initialTabWidth = await getElementLayoutWidth(editorTabs);
    const initialTerminalPanelHeight = await getElementLayoutHeight(terminalPanelBody);

    await expandWindowButton.click();

    const expandedHero = expandedOverlay.getByTestId('terminal-hero');
    const expandedEditorTabs = expandedHero.getByRole('tablist', { name: 'Editor tabs' });
    const expandedTerminalPanelBody = expandedHero.getByTestId('terminal-panel-body');

    await expect(expandedOverlay).toBeVisible();
    await expect(expandedHero).toHaveAttribute('data-expanded', 'true');

    const expandedRect = await expandedHero.boundingBox();
    const mainRect = await mainContent.boundingBox();
    const headerRect = await header.boundingBox();
    const viewport = page.viewportSize();

    expect(expandedRect).not.toBeNull();
    expect(mainRect).not.toBeNull();
    expect(viewport).not.toBeNull();

    if (!expandedRect || !mainRect || !viewport) {
      throw new Error('Expected expanded hero, main content, and viewport bounds to be available.');
    }

    const topBound = headerRect ? Math.max(0, headerRect.y + headerRect.height) : 0;
    const rightBound = Math.min(viewport.width, mainRect.x + mainRect.width);
    const bottomBound = Math.min(viewport.height, mainRect.y + mainRect.height);

    expect(expandedRect.x).toBeGreaterThanOrEqual(mainRect.x - 1);
    expect(expandedRect.y).toBeGreaterThanOrEqual(topBound - 1);
    expect(expandedRect.x + expandedRect.width).toBeLessThanOrEqual(rightBound + 1);
    expect(expandedRect.y + expandedRect.height).toBeLessThanOrEqual(bottomBound + 1);

    const expandedTabWidth = await getElementLayoutWidth(expandedEditorTabs);
    const expandedTerminalPanelHeight = await getElementLayoutHeight(expandedTerminalPanelBody);

    expect(expandedTabWidth).toBeGreaterThan(initialTabWidth + 200);
    expect(expandedTerminalPanelHeight).toBeGreaterThan(initialTerminalPanelHeight + 60);

    await expandedOverlay.getByRole('button', { name: 'Expand window' }).click();
    await expect(page.getByTestId('home-hero-window').getByTestId('terminal-hero')).toHaveAttribute(
      'data-expanded',
      'false'
    );
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

    // Start from the empty lower-left strip of the title bar so the drag path avoids
    // the interactive traffic dots and centered search affordance.
    const dragStartX = titleBarBox.x + 28;
    const dragStartY = titleBarBox.y + titleBarBox.height - 4;

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
    const serverTab = terminalHero.getByTestId('vscode-tab-server');
    const clientTab = terminalHero.getByTestId('vscode-tab-client');

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

    const initialWidth = await getElementLayoutWidth(terminalHero);

    await selectHeroEditorTab(terminalHero, clientTab, 'SERVER_URL');

    const clientWidth = await getElementLayoutWidth(terminalHero);

    await selectHeroEditorTab(terminalHero, serverTab, 'Ping Pong Server');

    const serverWidth = await getElementLayoutWidth(terminalHero);

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
