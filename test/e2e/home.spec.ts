import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const HOME_HEADLINE = 'Hi, my passions are mathematics, computers, and adventures';

const dismissWelcomeFlow = async (page: Page) => {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'No thanks' }).click();
  await expect(dialog).toBeHidden();

  const darkModeHint = page.getByText(/Try (light|dark) mode/i);
  await expect(darkModeHint).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(darkModeHint).toBeHidden();
};

test.describe('Home page (reduced motion)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('renders the hero content after completing the welcome sequence', async ({ page }) => {
    await page.goto('/');
    await dismissWelcomeFlow(page);

    // Hero text should appear after the full welcome sequence completes
    await expect(page.getByText(HOME_HEADLINE)).toBeVisible();
  });

  test('welcome audio prompt can be dismissed', async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Play welcome audio?')).toBeVisible();
    await dialog.getByRole('button', { name: 'No thanks' }).click();
    await expect(dialog).toBeHidden();
  });
});

test.describe('Home page (full motion)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('runs the in-flight hero motion before starting the typewriter', async ({ page }) => {
    await page.goto('/');
    await dismissWelcomeFlow(page);

    const heroMotionPath = page.getByTestId('hero-motion-path');
    const heroMotionShell = page.getByTestId('hero-motion-shell');
    const typewriterText = page.getByTestId('typewriter-text');

    await expect(heroMotionPath).toBeVisible();
    await expect(heroMotionShell).toBeVisible();
    await expect(typewriterText).toHaveAttribute('data-playing', 'false');

    await page.waitForFunction(
      () => {
        const path = document.querySelector('[data-testid="hero-motion-path"]');
        const shell = document.querySelector('[data-testid="hero-motion-shell"]');
        const typewriter = document.querySelector('[data-testid="typewriter-text"]');

        if (!path || !shell || !typewriter) {
          return false;
        }

        const pathTransform = window.getComputedStyle(path).transform;
        const shellStyle = window.getComputedStyle(shell);

        return (
          typewriter.getAttribute('data-playing') === 'false' &&
          pathTransform !== 'none' &&
          shellStyle.transform !== 'none' &&
          shellStyle.borderRadius !== '16px'
        );
      },
      undefined,
      { timeout: 2500 }
    );

    await page.screenshot({ path: '/tmp/playwright-logs/home-full-motion-inflight.png' });

    await expect(typewriterText).toHaveAttribute('data-playing', 'true', { timeout: 5000 });
    await expect(page.getByText(HOME_HEADLINE)).toBeVisible();
    await expect
      .poll(() =>
        heroMotionShell.evaluate((node) => window.getComputedStyle(node).borderRadius)
      )
      .toBe('16px');
  });
});
