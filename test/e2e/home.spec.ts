import { test, expect, type Locator, type Page } from '@playwright/test';
import { expectImmediateHome, resetWelcomeState } from './helpers/header';

const HOME_SCREENSHOT_CLOCK_START = new Date('2026-03-17T12:00:00.000Z');
const STABLE_TERMINAL_OUTPUT_TEXT =
  /v22\.14\.0|9ab2238 polish: terminal UI chrome|Compiled successfully in 2\.4s|mathematics|julia version 1\.10\.10|==> Formulae/;
const TERMINAL_NOTIFICATION_TEXT = 'server.py — No problems detected ✓';
const SERVER_EDITOR_TEXT = 'Ping Pong Server';
const CLIENT_EDITOR_TEXT = 'SERVER_URL';
const HOME_ACTIVE_TERMINAL_HERO_SELECTOR =
  '[data-testid="home-ide-expanded"] [data-testid="terminal-hero"], [data-testid="home-hero-window"] [data-testid="terminal-hero"]';

const getWindowedTerminalHero = (page: Page) =>
  page.getByTestId('home-hero-window').getByTestId('terminal-hero');

const getExpandedTerminalHero = (page: Page) =>
  page.getByTestId('home-ide-expanded').getByTestId('terminal-hero');

const getActiveTerminalHero = (page: Page) =>
  page.locator(HOME_ACTIVE_TERMINAL_HERO_SELECTOR).last();

const waitForHomeTerminalHero = async (page: Page) => {
  const terminalHero = getActiveTerminalHero(page);
  await expect(terminalHero).toBeVisible();
  return terminalHero;
};

const waitForStableHomeTerminalHero = async (page: Page) => {
  const terminalHero = await waitForHomeTerminalHero(page);
  await waitForStableTerminalHero(page, terminalHero);
  return getActiveTerminalHero(page);
};

const ensureWindowedTerminalHero = async (page: Page) => {
  const expandedOverlay = page.getByTestId('home-ide-expanded');
  let collapsedExpandedOverlay = false;

  if (await expandedOverlay.isVisible().catch(() => false)) {
    collapsedExpandedOverlay = true;
    await expandedOverlay.getByRole('button', { name: 'Expand window' }).click();
    await expect(expandedOverlay).toBeHidden();
  }

  const terminalHero = getWindowedTerminalHero(page);
  await expect(terminalHero).toBeVisible();

  if (collapsedExpandedOverlay) {
    await waitForStableTerminalHero(page, terminalHero);
  }

  return terminalHero;
};

const moveMouseAwayFromHero = async (page: Page) => {
  await page.mouse.move(4, 4);
};

const getBounds = async (locator: Locator) => {
  const bounds = await locator.boundingBox();
  if (!bounds) throw new Error('Expected visible element bounds');
  return bounds;
};

const getElementLayoutWidth = async (element: Locator) =>
  element.evaluate((node) => (node as HTMLElement).offsetWidth);

const getElementLayoutHeight = async (element: Locator) =>
  element.evaluate((node) => (node as HTMLElement).offsetHeight);

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

const expectPingPongHeroMetadata = async (terminalHero: Locator) => {
  await expect(terminalHero).toHaveAttribute('aria-label', /node --version/);
  await expect(terminalHero).toHaveAttribute('aria-label', /git log --oneline -1/);
  await expect(terminalHero).toHaveAttribute('aria-label', /npm run build/);
  await expect(terminalHero).toHaveAttribute('aria-label', /whoami --passions/);
  await expect(terminalHero).toHaveAttribute('aria-label', /brew ls/);
};

const waitForStableTerminalHero = async (page: Page, terminalHero: Locator) => {
  const terminalPanelBody = terminalHero.getByTestId('terminal-panel-body');

  await expect(terminalHero.getByTestId('vscode-tab-server')).toHaveAttribute(
    'aria-selected',
    'true',
    { timeout: 20000 }
  );
  await expect(terminalHero).toContainText('Ping Pong Server', { timeout: 20000 });
  await expectPingPongHeroMetadata(terminalHero);
  await expect(terminalPanelBody).toContainText(STABLE_TERMINAL_OUTPUT_TEXT, { timeout: 20000 });
  await dismissTerminalNotificationToast(page);

  await moveMouseAwayFromHero(page);
};

const resetHomeScrollForScreenshot = async (page: Page, terminalHero: Locator) => {
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  await expect(terminalHero).toBeVisible();
};

test.describe('Home page', () => {
  test('keeps optional preferences open while a control has focus', async ({ page }) => {
    await resetWelcomeState(page);
    await page.clock.install({ time: HOME_SCREENSHOT_CLOCK_START });
    await page.goto('/');
    await expectImmediateHome(page);
    await expect(page.getByRole('link', { name: 'Explore my CV' })).toBeVisible();
    await page.getByRole('button', { name: 'Customize appearance & audio' }).click();
    const preferences = page.getByRole('region', { name: 'Make yourself at home' });
    await preferences.getByRole('button', { name: 'Off', exact: true }).focus();
    await expect(page.getByRole('button', { name: 'Off', exact: true })).toBeFocused();
    await expect(page.getByText('Take your time — this stays open while you choose.')).toBeVisible();
    await page.clock.runFor(10_000);
    await expect(preferences).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(preferences).toBeHidden();
  });

  test('renders hero content without a welcome sequence', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    const terminalHero = await waitForHomeTerminalHero(page);

    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|python --version|julia --version|brew ls/,
      { timeout: 20000 }
    );
    await expect(terminalHero).toContainText(
      /v22\.14\.0|9ab2238|Compiled successfully|mathematics|Python 3\.14|julia version|Formulae/,
      { timeout: 20000 }
    );
  });

  test('keeps the hero windowed until the user chooses to expand it', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');
    await expectImmediateHome(page);
    const hero = await waitForStableHomeTerminalHero(page);
    await expect(hero).toHaveAttribute('data-expanded', 'false');
    await expect(page.getByTestId('home-ide-expanded')).toHaveCount(0);
    await hero.getByRole('button', { name: 'Expand window' }).click();
    await expect(getExpandedTerminalHero(page)).toHaveAttribute('data-expanded', 'true');
    await expect(getWindowedTerminalHero(page)).toHaveCount(0);
  });

  test('renders the desktop AppBar navigation and keeps audio recovery available after onboarding', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    const siteNavigation = page.locator('#site-navigation');
    const settingsTrigger = page.getByTestId('header-settings-trigger');

    await page.getByRole('button', { name: 'Customize appearance & audio' }).click();

    const preferences = page.getByRole('region', { name: 'Make yourself at home' });
    await expect(preferences).toBeVisible();
    await preferences.getByRole('button', { name: 'Explore now' }).click();
    await expect(preferences).toBeHidden();
    await expect(settingsTrigger).toHaveAttribute('data-highlighted', 'false');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    await expect(siteNavigation).toBeVisible();
    await expect(siteNavigation.getByText('CV', { exact: true })).toBeVisible();
    await expect(siteNavigation.getByText('Climbing', { exact: true })).toBeVisible();
    await expect(siteNavigation.getByText('Photography', { exact: true })).toBeVisible();

    const blogNavigationLink = siteNavigation.getByText('Blog', { exact: true });
    await expect(blogNavigationLink).toBeVisible();

    await expect(settingsTrigger).toBeVisible();

    await settingsTrigger.click();

    const settingsPopover = page.getByTestId('settings-popover-content');
    await expect(settingsPopover).toBeVisible();
    await expect(settingsPopover.getByText('Theme', { exact: true })).toBeVisible();
    await expect(settingsPopover.getByText(/Dark mode|Light mode/)).toBeVisible();
    await expect(settingsPopover.locator('[role="switch"]')).toHaveCount(1);
    await expect(
      settingsPopover.getByRole('radiogroup', { name: 'Appearance presets' })
    ).toBeVisible();
    await expect(settingsPopover.getByRole('radio', { name: 'Evergreen (active)' })).toBeVisible();
    await expect(settingsPopover.getByRole('radio', { name: 'Graphite' })).toBeVisible();
    await expect(settingsPopover.getByRole('button', { name: 'Default' })).toBeVisible();
    await expect(settingsPopover.getByRole('button', { name: 'Expressive' })).toBeVisible();
    await expect(settingsPopover.getByText('Welcome audio', { exact: true })).toBeVisible();
    await expect(settingsPopover.getByRole('button', { name: 'Play welcome audio' })).toBeVisible();
  });

  test('shows the restored ping pong surfaces for the post-boot home terminal hero', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.clock.install({ time: HOME_SCREENSHOT_CLOCK_START });
    await page.goto('/');

    await expectImmediateHome(page);

    await waitForStableHomeTerminalHero(page);

    const terminalHero = await ensureWindowedTerminalHero(page);

    await resetHomeScrollForScreenshot(page, terminalHero);
    await expect(terminalHero).toContainText(SERVER_EDITOR_TEXT, { timeout: 20000 });
    await terminalHero.getByRole('button', { name: 'Explorer', exact: true }).click();
    await expect(terminalHero.getByText('Explorer', { exact: true })).toBeVisible();
    await expect(terminalHero).toContainText('DANHENDERSON.DEV');
    await expect(terminalHero.getByTestId('terminal-panel-body')).toContainText(
      STABLE_TERMINAL_OUTPUT_TEXT
    );
    await expectPingPongHeroMetadata(terminalHero);
  });

  test('switches to the client tab and shows client editor content in the home terminal hero', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.clock.install({ time: HOME_SCREENSHOT_CLOCK_START });
    await page.goto('/');

    await expectImmediateHome(page);

    const terminalHero = await waitForStableHomeTerminalHero(page);
    const clientTab = terminalHero.getByTestId('vscode-tab-client');

    await resetHomeScrollForScreenshot(page, terminalHero);
    await expect(terminalHero).toContainText(SERVER_EDITOR_TEXT, { timeout: 20000 });

    await selectHeroEditorTab(terminalHero, clientTab, CLIENT_EDITOR_TEXT);
    await expect(terminalHero).toContainText('PingResponse');
    await expect(terminalHero).toContainText('client.ts');
  });

  test('traffic dots close the IDE and restore a fresh server session', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    const terminalHero = await waitForStableHomeTerminalHero(page);
    const clientTab = terminalHero.getByTestId('vscode-tab-client');
    const closeWindowButton = page.getByRole('button', { name: 'Close window' });
    const restoreWindowButton = page.getByRole('button', { name: 'Open Visual Studio Code' });

    await selectHeroEditorTab(terminalHero, clientTab, CLIENT_EDITOR_TEXT);

    await closeWindowButton.click();
    await expect(page.locator(HOME_ACTIVE_TERMINAL_HERO_SELECTOR)).toHaveCount(0);
    await expect(restoreWindowButton).toBeVisible();

    await restoreWindowButton.click();

    const restoredHero = getWindowedTerminalHero(page);
    await expect(restoredHero).toBeVisible();
    await expect(restoredHero).toContainText(SERVER_EDITOR_TEXT);
    await expect(restoredHero).not.toContainText(CLIENT_EDITOR_TEXT);
  });

  test('traffic dots minimize the IDE and restore a fresh server session', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    const terminalHero = await waitForStableHomeTerminalHero(page);
    const clientTab = terminalHero.getByTestId('vscode-tab-client');
    const minimizeWindowButton = page.getByRole('button', { name: 'Minimize window' });
    const restoreMinimizedBar = page.getByRole('button', { name: 'Restore window' });

    await selectHeroEditorTab(terminalHero, clientTab, CLIENT_EDITOR_TEXT);

    await minimizeWindowButton.click();
    await expect(page.locator(HOME_ACTIVE_TERMINAL_HERO_SELECTOR)).toHaveCount(0);
    await expect(restoreMinimizedBar).toBeVisible();

    await restoreMinimizedBar.click();

    const restoredHero = getWindowedTerminalHero(page);
    await expect(restoredHero).toBeVisible();
    await expect(restoredHero).toContainText(SERVER_EDITOR_TEXT);
    await expect(restoredHero).not.toContainText(CLIENT_EDITOR_TEXT);
  });

  test('expands the IDE within the visible page viewport and resizes the inner panes', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    await waitForStableHomeTerminalHero(page);

    const terminalHero = await ensureWindowedTerminalHero(page);
    const expandWindowButton = terminalHero.getByRole('button', { name: 'Expand window' });
    const clientTab = terminalHero.getByTestId('vscode-tab-client');
    const expandedOverlay = page.getByTestId('home-ide-expanded');
    const mainContent = page.locator('#main-content');
    const header = page.locator('#site-navigation');
    const editorTabs = terminalHero.getByRole('tablist', { name: 'Editor tabs' });
    const terminalPanelBody = terminalHero.getByTestId('terminal-panel-body');

    await expect(expandWindowButton).toBeVisible();

    await selectHeroEditorTab(terminalHero, clientTab, CLIENT_EDITOR_TEXT);

    const initialTabWidth = await getElementLayoutWidth(editorTabs);
    const initialTerminalPanelHeight = await getElementLayoutHeight(terminalPanelBody);

    await expandWindowButton.click();

    const expandedHero = expandedOverlay.getByTestId('terminal-hero');
    const expandedEditorTabs = expandedHero.getByRole('tablist', { name: 'Editor tabs' });
    const expandedTerminalPanelBody = expandedHero.getByTestId('terminal-panel-body');

    await expect(expandedOverlay).toBeVisible();
    await expect(expandedHero).toHaveAttribute('data-expanded', 'true');
    await expect(expandedHero).toContainText(CLIENT_EDITOR_TEXT);
    await expect(expandedHero.getByTestId('vscode-tab-client')).toHaveAttribute(
      'aria-selected',
      'true'
    );

    const expandedRect = await getBounds(expandedHero);
    const mainRect = await getBounds(mainContent);
    const headerRect = await getBounds(header);
    const viewport = page.viewportSize()!;

    expect(expandedRect).not.toBeNull();
    expect(mainRect).not.toBeNull();
    expect(viewport).not.toBeNull();

    const topBound = Math.max(0, headerRect.y + headerRect.height);
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

    const collapsedHero = page.getByTestId('home-hero-window').getByTestId('terminal-hero');
    await expect(collapsedHero).toHaveAttribute('data-expanded', 'false');
    await expect(collapsedHero).toContainText(CLIENT_EDITOR_TEXT);
    await expect(collapsedHero.getByTestId('vscode-tab-client')).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('allows dragging the hero window by the title bar within the home route', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    await waitForStableHomeTerminalHero(page);

    const terminalHero = await ensureWindowedTerminalHero(page);
    const titleBar = page.getByTestId('vscode-title-bar');
    const mainRegion = page.locator('main').last();

    await expect(titleBar).toBeVisible();
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|brew ls/,
      {
        timeout: 20000,
      }
    );

    const heroBefore = await getBounds(terminalHero);
    const titleBarBox = await getBounds(titleBar);
    const mainBox = await getBounds(mainRegion);

    expect(heroBefore).not.toBeNull();
    expect(titleBarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    // Start from the empty lower-left strip of the title bar so the drag path avoids
    // the interactive traffic dots and centered search affordance.
    const dragStartX = titleBarBox.x + 28;
    const dragStartY = titleBarBox.y + titleBarBox.height - 4;

    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragStartX + 120, dragStartY - 56, { steps: 12 });
    await page.mouse.up();

    const heroAfter = await getBounds(terminalHero);

    expect(heroAfter).not.toBeNull();

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

    await expectImmediateHome(page);

    await waitForStableHomeTerminalHero(page);

    const terminalHero = await ensureWindowedTerminalHero(page);
    const serverTab = terminalHero.getByTestId('vscode-tab-server');
    const clientTab = terminalHero.getByTestId('vscode-tab-client');

    await expect(serverTab).toBeVisible();
    await expect(clientTab).toBeVisible();
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|brew ls/,
      { timeout: 20000 }
    );
    await expect(terminalHero).toContainText(
      /node --version|git log|npm run build|whoami --passions|python --version|julia --version|brew ls/,
      { timeout: 20000 }
    );

    const initialWidth = await getElementLayoutWidth(terminalHero);

    await selectHeroEditorTab(terminalHero, clientTab, CLIENT_EDITOR_TEXT);

    const clientWidth = await getElementLayoutWidth(terminalHero);

    await selectHeroEditorTab(terminalHero, serverTab, SERVER_EDITOR_TEXT);

    const serverWidth = await getElementLayoutWidth(terminalHero);

    expect(Math.abs(clientWidth - initialWidth)).toBeLessThanOrEqual(2);
    expect(Math.abs(serverWidth - initialWidth)).toBeLessThanOrEqual(2);
  });

  test('keeps the hero window width stable when toggling the explorer sidebar after boot', async ({
    page,
  }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    await waitForStableHomeTerminalHero(page);

    const terminalHero = await ensureWindowedTerminalHero(page);
    const explorerToggle = terminalHero.getByTestId('activity-icon-0');
    const explorerSidebarLabel = terminalHero.getByText('Explorer');

    await expect(explorerToggle).toBeVisible();
    await explorerToggle.click();
    await expect(explorerSidebarLabel).toBeVisible();

    const explorerOpenWidth = await getElementLayoutWidth(terminalHero);

    await explorerToggle.click();
    await expect(explorerSidebarLabel).toBeHidden();

    const explorerClosedWidth = await getElementLayoutWidth(terminalHero);

    await explorerToggle.click();
    await expect(explorerSidebarLabel).toBeVisible();

    const explorerReopenedWidth = await getElementLayoutWidth(terminalHero);

    expect(Math.abs(explorerClosedWidth - explorerOpenWidth)).toBeLessThanOrEqual(2);
    expect(Math.abs(explorerReopenedWidth - explorerOpenWidth)).toBeLessThanOrEqual(2);
  });

  test('keeps the hero window height stable during horizontal resize', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');

    await expectImmediateHome(page);

    await waitForStableHomeTerminalHero(page);

    const terminalHero = await ensureWindowedTerminalHero(page);
    const resizeHandle = page.getByTestId('resize-handle-right');

    await expect(resizeHandle).toBeVisible();

    const initialWidth = await getElementLayoutWidth(terminalHero);
    const initialHeight = await getElementLayoutHeight(terminalHero);
    const handleBox = await getBounds(resizeHandle);

    expect(handleBox).not.toBeNull();

    const dragStartX = handleBox.x + handleBox.width / 2;
    const dragStartY = handleBox.y + handleBox.height / 2;

    await resizeHandle.dispatchEvent('pointerdown', {
      button: 0,
      clientX: dragStartX,
      clientY: dragStartY,
      pointerType: 'mouse',
    });
    await page.mouse.move(dragStartX + 120, dragStartY, { steps: 12 });
    await page.locator('body').dispatchEvent('pointerup', {
      button: 0,
      clientX: dragStartX + 120,
      clientY: dragStartY,
      pointerType: 'mouse',
    });

    const resizedWidth = await getElementLayoutWidth(terminalHero);
    const resizedHeight = await getElementLayoutHeight(terminalHero);

    expect(resizedWidth).toBeGreaterThan(initialWidth + 40);
    expect(Math.abs(resizedHeight - initialHeight)).toBeLessThanOrEqual(2);
  });

  test('keeps the settled IDE mounted and stationary after motion preferences change', async ({ page }) => {
    await page.goto('/');
    const hero = getWindowedTerminalHero(page);
    await expect(hero).toHaveAttribute('data-playing', 'true');
    const originalNodes = await page.getByTestId('home-hero-window').evaluateHandle((window) => ({
      wrapper: window.parentElement!,
      terminal: window.querySelector('[data-testid="terminal-hero"]')!,
    }));
    await page.getByRole('button', { name: 'Open settings' }).click();
    for (const level of ['Subtle', 'Expressive', 'Off', 'Default']) {
      await page.getByRole('button', { name: level, exact: true }).click();
      const stable = await originalNodes.evaluate(async ({ wrapper, terminal }) => {
        const end = performance.now() + 700;
        do {
          await new Promise(requestAnimationFrame);
          if (!wrapper.isConnected || !terminal.isConnected) return false;
          if (!new DOMMatrixReadOnly(getComputedStyle(wrapper).transform).isIdentity) return false;
        } while (performance.now() < end);
        return true;
      });
      expect(stable).toBe(true);
      await expect(hero).toHaveAttribute('data-expanded', 'false');
    }
    await originalNodes.dispose();
    await page.keyboard.press('Escape');
    await hero.getByRole('button', { name: 'Expand window' }).click();
    await expect(getExpandedTerminalHero(page)).toBeVisible();
  });

  test('does not grant audio consent on an ordinary first visit', async ({ page }) => {
    await resetWelcomeState(page);
    await page.goto('/');
    await expectImmediateHome(page);
    expect(
      await page.evaluate(() => localStorage.getItem('danhenderson-welcome-audio-consent'))
    ).not.toBe('granted');
    await page.getByTestId('header-settings-trigger').click();
    await expect(page.getByRole('button', { name: 'Play welcome audio' })).toBeVisible();
  });
});
