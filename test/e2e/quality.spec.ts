import { test, expect, type Page } from '@playwright/test';

const postPath = '/blog/fixing-and-enforcing-none-type-drift-with-a-codemod';
const presets = ['atlas', 'evergreen', 'ember', 'solstice', 'drift', 'graphite'];

const seedAppearance = async (page: Page, appearance = 'atlas', mode = 'light', motion = 'off') => {
  await page.addInitScript(
    ({ appearance, mode, motion }) => {
      localStorage.setItem('danhenderson-appearance', appearance);
      localStorage.setItem('danhenderson-theme', mode);
      localStorage.setItem('danhenderson-motion', motion);
    },
    { appearance, mode, motion }
  );
};

// The opaque article surface makes this a direct foreground/background measurement.
const readArticleContrast = async (page: Page) =>
  page.locator('header[aria-labelledby="article-title"]').evaluate((header) => {
    const luminance = (color: string) => {
      const values = color
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((n) => {
          const c = n / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    };
    const bg = luminance(getComputedStyle(header).backgroundColor);
    return Array.from(header.querySelectorAll('h1,p')).map((element) => {
      const fg = luminance(getComputedStyle(element).color);
      return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
    });
  });

for (const preset of presets) {
  for (const mode of ['light', 'dark']) {
    test(`valid fonts and readable article in ${preset} ${mode}`, async ({ page }) => {
      await seedAppearance(page, preset, mode);
      await page.goto(postPath);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const fonts = await page.evaluate(async () => {
        await document.fonts.ready;
        const body = getComputedStyle(document.body).fontFamily;
        const heading = getComputedStyle(document.querySelector('h1')!).fontFamily;
        return {
          body,
          valid: [body, heading].every((stack) => CSS.supports('font-family', stack)),
          loaded: document.fonts.check('16px "Source Sans 3"'),
        };
      });
      expect(fonts.valid).toBe(true);
      expect(fonts.loaded).toBe(true);
      expect(fonts.body).toContain('"Source Sans 3"');
      const contrast = await readArticleContrast(page);
      expect(contrast.length).toBeGreaterThan(1);
      expect(Math.min(...contrast)).toBeGreaterThanOrEqual(4.5);
    });
  }
}

for (const width of [320, 390, 768, 1440]) {
  test(`album content and original downloads remain usable at ${width}px`, async ({ page }) => {
    await seedAppearance(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/photography/landscape');
    const title = page.getByRole('heading', { level: 1, name: 'Landscape' });
    await expect(title).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share Landscape album' })).toBeVisible();
    await page.getByText('10 photo locations', { exact: true }).click();
    await expect(page.locator('details')).toHaveAttribute('open', '');
    const gallery = page.getByRole('list', { name: 'Landscape photo gallery' });
    const firstPhoto = gallery.getByRole('button').first();
    await firstPhoto.scrollIntoViewIfNeeded();
    await expect(firstPhoto).toHaveAttribute('srcset', /\.webp \d+w/);
    const metrics = await firstPhoto.evaluate((node) => ({
      width: node.getBoundingClientRect().width,
      source: (node as HTMLImageElement).currentSrc,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    expect(metrics.overflow).toBe(false);
    expect(metrics.width).toBeGreaterThan(150);
    expect(metrics.source).toContain('/assets/display/');
    await expect(gallery.getByRole('link', { name: /^Download/ }).first()).toHaveAttribute(
      'href',
      /\/assets\/photography\/.*\.jpg$/
    );
    await firstPhoto.focus();
    await page.keyboard.press('Enter');
    const lightbox = page.getByRole('dialog', { name: /Immersive photo viewer/ });
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('img')).toHaveAttribute('srcset', /\.webp \d+w/);
    await page.keyboard.press('ArrowRight');
    await expect(lightbox.getByText('2 / 15', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
    await expect(firstPhoto).toBeFocused();
  });
}

test('standard routes have one main, one h1, and no narrow overflow', async ({ page }) => {
  await seedAppearance(page);
  await page.setViewportSize({ width: 320, height: 812 });
  for (const route of [
    '/',
    '/cv',
    '/climbing',
    '/photography',
    '/blog',
    postPath,
    '/missing-page',
    '/photography/missing',
    '/blog/missing',
  ]) {
    await test.step(route, async () => {
      await page.goto(route);
      await expect(page.locator('main')).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
    });
  }
});

test('keyboard users can reveal CV and climbing content and reach labeled search', async ({
  page,
}) => {
  await seedAppearance(page);
  await page.goto('/cv');
  const reveal = page.getByRole('button', { name: 'Explore full CV' });
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#cv-experience')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Download resume' })).toHaveAttribute('download');
  await page.goto('/climbing');
  await page.getByRole('button', { name: 'View climbing log' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#climbing-log')).toBeFocused();
  await page.getByRole('textbox', { name: 'Search climbed routes' }).fill('unlikely route search');
  await expect(page.getByText('No climbed routes match this search.')).toBeVisible();
});

test('a first visit can go straight to projects and retains article metadata on client navigation', async ({
  page,
}) => {
  await seedAppearance(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'View projects' }).click();
  await expect(page).toHaveURL(/\/cv#cv-coding$/);
  await expect(page.locator('#cv-coding')).toBeFocused();
  await page.goto('/photography/landscape');
  await page.getByRole('link', { name: 'Go to Blog', exact: true }).click();
  await page
    .getByRole('link', { name: /Fixing and Enforcing None-Type Drift/ })
    .first()
    .click();
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  const navigatedImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  await page.reload();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    navigatedImage!
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
});

test('reduced motion shows a stable terminal immediately', async ({ page }) => {
  await seedAppearance(page, 'atlas', 'light', 'default');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const terminal = page.getByTestId('terminal-panel-body');
  await expect(terminal).toContainText('brew ls');
  const transcript = await terminal.textContent();
  await page.clock.runFor(15_000);
  await expect(terminal).toHaveText(transcript!);
  await expect(page.getByTestId('home-ide-expanded')).toHaveCount(0);
});

test('turning motion off during the entrance completes the hero and stops the terminal loop', async ({
  page,
}) => {
  await seedAppearance(page, 'atlas', 'light', 'expressive');
  await page.goto('/');
  await page.getByTestId('header-settings-trigger').click();
  await page.getByRole('button', { name: 'Off', exact: true }).click();
  await page.keyboard.press('Escape');
  const terminal = page.getByTestId('terminal-panel-body');
  await expect(page.getByTestId('terminal-hero')).toHaveAttribute('data-playing', 'true');
  await expect(terminal).toContainText('brew ls');
  const transcript = await terminal.textContent();
  await page.clock.install();
  await page.clock.runFor(15_000);
  await expect(terminal).toHaveText(transcript!);
  await page.getByRole('button', { name: 'Close window' }).click();
  await expect(page.getByRole('button', { name: 'Open Visual Studio Code' })).toBeVisible();
});
