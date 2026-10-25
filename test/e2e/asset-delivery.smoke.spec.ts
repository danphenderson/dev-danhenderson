import { test, expect, type Locator, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { certificates, resumeDownloadFilename, resumePdfUrl } from '../../src/data/cv';
import { photographyCategories } from '../../src/data/photography';
import { declineWelcomeAudio } from './helpers/header';
import { mockGitHubAPIFailure } from './helpers/github';

const basePath = (process.env.PUBLIC_URL ?? '').replace(/\/+$/, '');
const routePath = (path: string) => `${basePath}${path}`;

test.use({ reducedMotion: 'reduce' });

async function activate(link: Locator, isMobile: boolean) {
  if (isMobile) await link.tap();
  else await link.click();
}

async function resumeAction(page: Page, entry: string, isMobile: boolean) {
  if (entry === 'header') {
    return page.getByRole('link', { name: 'Download resume', exact: true });
  }
  const trigger = page.getByRole('button', { name: 'Open about actions' });
  if (isMobile) await trigger.tap();
  else await trigger.focus();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(await trigger.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  })).toBe(true);
  return page.getByRole('menuitem', { name: 'Download Resume' });
}

async function expectDecoded(image: Locator, source: RegExp) {
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element: HTMLImageElement) =>
    element.complete && element.naturalWidth > 0 && element.naturalHeight > 0
  )).toBe(true);
  expect(await image.evaluate((element: HTMLImageElement) => element.currentSrc)).toMatch(source);
}

async function checkPhotography(page: Page, source: RegExp, everyTile = true) {
  await page.goto(routePath('/photography'));
  await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible();
  const covers = page.locator('main img');
  await expect(covers).toHaveCount(photographyCategories.length);
  for (const cover of await covers.all()) await expectDecoded(cover, source);
  await expect(page.getByRole('status', { name: 'Loading photography albums' })).toHaveCount(0);

  // Exercise the same hero, tiles, and lightbox that mobile visitors use.
  await page.goto(routePath('/photography/landscape'));
  await expect(page.getByRole('heading', { name: 'Landscape', exact: true })).toBeVisible();
  await expectDecoded(page.getByRole('img', { name: 'Landscape', exact: true }), source);
  const gallery = page.getByRole('list', { name: 'Landscape photo gallery' });
  const tiles = gallery.locator('img');
  await expect(tiles).toHaveCount(photographyCategories[0].album.length);
  const checkedTiles = everyTile ? await tiles.all() : [tiles.first()];
  for (const tile of checkedTiles) await expectDecoded(tile, source);
  const firstPhoto = tiles.first();
  await firstPhoto.click();
  const lightbox = page.getByRole('dialog', { name: /Immersive photo viewer/ });
  await expectDecoded(lightbox.locator('img'), source);
  await expect(lightbox.getByRole('link', { name: /^Download/ })).toHaveAttribute(
    'href', new RegExp(`^${basePath}/assets/photography/.*\\.jpg$`)
  );
  await lightbox.getByRole('button', { name: 'Next photo' }).click();
  await expectDecoded(lightbox.locator('img'), source);
  await lightbox.getByRole('button', { name: 'Close lightbox' }).click();
  await expect(lightbox).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await declineWelcomeAudio(page);
  await mockGitHubAPIFailure(page);
});

for (const entry of ['header', 'menu']) {
  test(`${entry} resume action downloads real PDF bytes`, async ({ page, isMobile }, testInfo) => {
    await page.goto(routePath('/cv'));
    const link = await resumeAction(page, entry, isMobile);
    await expect(link).toHaveAttribute('href', resumePdfUrl);
    await expect(link).toHaveAttribute('download', resumeDownloadFilename);
    const pendingDownload = page.waitForEvent('download');
    await activate(link, isMobile);
    const download = await pendingDownload;
    const saved = testInfo.outputPath(`${entry}-resume.pdf`);
    await download.saveAs(saved);
    expect(await download.failure()).toBeNull();
    expect((await readFile(saved)).subarray(0, 5).toString()).toBe('%PDF-');
  });
}

test('certificate clicks request real PDFs rather than SPA documents', async ({ page, context, isMobile }) => {
  test.setTimeout(60_000);
  await page.goto(routePath('/cv#cv-certificates'), { waitUntil: 'domcontentloaded' });
  await page.locator('#cv-certificates').scrollIntoViewIfNeeded();
  const links = page.locator('#cv-certificates a[href$=".pdf"]');
  await expect(links).toHaveCount(certificates.length);
  for (let index = 0; index < certificates.length; index += 1) {
    const link = links.nth(index);
    const href = certificates[index].link!;
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
    await expect(link).toHaveText('View Certificate');
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    const requested = context.waitForEvent('request', {
      predicate: (request) => new URL(request.url()).pathname === href,
    });
    await activate(link, isMobile);
    const request = await requested;
    const response = await context.request.get(request.url());
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^application\/pdf\b/);
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
    for (const popup of context.pages().filter((candidate) => candidate !== page)) {
      await popup.close();
    }
    await page.bringToFront();
  }
});

test('PDF byte-range requests retain their status, headers, and bytes', async ({ request }) => {
  for (const path of [resumePdfUrl, ...certificates.map((certificate) => certificate.link!)]) {
    const response = await request.get(path, { headers: { Range: 'bytes=0-4' } });
    expect(response.status()).toBe(206);
    expect(response.headers()['content-type']).toMatch(/^application\/pdf\b/);
    expect(response.headers()['content-range']).toMatch(/^bytes 0-4\/\d+$/);
    expect((await response.body()).toString()).toBe('%PDF-');
  }
});

test('responsive album covers, gallery tiles, and lightbox images decode', async ({ page }) => {
  test.setTimeout(90_000);
  await checkPhotography(page, /\/assets\/display\/.*\.webp$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test.describe('unavailable display images', () => {
  // Route interception cannot override a worker fetch; these tests isolate the UI fallback.
  test.use({ serviceWorkers: 'block' });
  for (const status of [404, 200]) {
    test(`recovers originals when derivatives return ${status} HTML`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.route('**/assets/display/**', (route) => route.fulfill({
        status,
        contentType: 'text/html',
        body: '<!doctype html><title>Misconfigured SPA rewrite</title>',
      }));
      await checkPhotography(page, /\/assets\/photography\/.*\.jpg$/, false);
      await expect(page.getByRole('list', { name: 'Landscape photo gallery' }).locator('img').first())
        .not.toHaveAttribute('srcset');
    });
  }
});
