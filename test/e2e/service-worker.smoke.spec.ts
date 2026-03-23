import { test, expect, type Page } from '@playwright/test';
import { cp, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { declineWelcomeAudio } from './helpers/header';

/**
 * Production service worker smoke coverage.
 *
 * Validates that same-path runtime assets refresh after a simulated
 * redeploy and that controlled deep-link reloads recover through the
 * cached app shell on hosts without server-side rewrites.
 */

const BUILD_DIRECTORY = resolve(process.cwd(), 'build');
const PROBE_ASSET_PATH = '/assets/home.jpg';

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

type TemporaryDeployment = {
  assetPath: string;
  rootDir: string;
  tempDir: string;
  url: string;
  close: () => Promise<void>;
};

type TemporaryDeploymentOptions = {
  rewriteNavigations?: boolean;
};

type ProbeMetrics = {
  cached: boolean;
  cachedSize: number | null;
  naturalHeight: number;
  naturalWidth: number;
};

const resolveServedFilePath = async (
  rootDir: string,
  requestPath: string,
  rewriteNavigations: boolean
) => {
  const normalizedRoot = resolve(rootDir);
  const relativeRequestPath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const candidatePath = resolve(normalizedRoot, relativeRequestPath);

  if (candidatePath !== normalizedRoot && !candidatePath.startsWith(`${normalizedRoot}${sep}`)) {
    return null;
  }

  try {
    const candidateStats = await stat(candidatePath);

    if (candidateStats.isDirectory()) {
      return resolve(normalizedRoot, 'index.html');
    }

    return candidatePath;
  } catch {
    if (rewriteNavigations && !extname(relativeRequestPath)) {
      return resolve(normalizedRoot, 'index.html');
    }

    return null;
  }
};

const createTemporaryDeployment = async (
  options: TemporaryDeploymentOptions = {}
): Promise<TemporaryDeployment> => {
  const { rewriteNavigations = true } = options;
  const tempParentDir = await mkdtemp(join(tmpdir(), 'dev-danhenderson-sw-redeploy-'));
  const rootDir = join(tempParentDir, 'deployment');
  await cp(BUILD_DIRECTORY, rootDir, { recursive: true });

  const server = createServer(async (request, response) => {
    if (request.method && !['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }

    const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
    const filePath = await resolveServedFilePath(rootDir, requestUrl.pathname, rewriteNavigations);

    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Content-Type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    response.end(body);
  });

  await new Promise<void>((resolveListen) => {
    server.listen(0, '127.0.0.1', () => resolveListen());
  });

  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Failed to bind temporary deployment server');
  }

  return {
    assetPath: join(rootDir, 'assets', 'home.jpg'),
    rootDir,
    tempDir: tempParentDir,
    url: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolveClose, rejectClose) => {
        server.close((error) => {
          if (error) {
            rejectClose(error);
            return;
          }

          resolveClose();
        });
      }),
  };
};

const ensureServiceWorkerControlsPage = async (page: Page) => {
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
  await page.reload({ waitUntil: 'load' });
  await expect(page.locator('#main-content')).toBeVisible();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
};

const readProbeMetrics = async (page: Page, probeUrl: string): Promise<ProbeMetrics> =>
  page.evaluate(async (assetUrl) => {
    document.getElementById('sw-redeploy-probe')?.remove();

    const image = document.createElement('img');
    image.id = 'sw-redeploy-probe';
    image.alt = 'service worker redeploy probe';
    image.src = assetUrl;
    document.body.appendChild(image);

    await new Promise<void>((resolve, reject) => {
      if (image.complete && image.naturalWidth > 0) {
        resolve();
        return;
      }

      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load probe asset: ${assetUrl}`));
    });

    let cachedSize: number | null = null;

    for (const cacheKey of await caches.keys()) {
      const cachedResponse = await (await caches.open(cacheKey)).match(assetUrl);

      if (!cachedResponse) {
        continue;
      }

      cachedSize = (await cachedResponse.clone().blob()).size;
      break;
    }

    return {
      cached: cachedSize !== null,
      cachedSize,
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
    };
  }, probeUrl);

const createReplacementJpeg = async (page: Page) => {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('2D canvas context is unavailable');
    }

    context.fillStyle = '#ff5a36';
    context.fillRect(0, 0, 1, 1);

    return canvas.toDataURL('image/jpeg', 1);
  });

  return Buffer.from(dataUrl.replace('data:image/jpeg;base64,', ''), 'base64');
};

const disposeTemporaryDeployment = async (deployment: TemporaryDeployment) => {
  await deployment.close();
  await rm(deployment.tempDir, { force: true, recursive: true });
};

test.describe('Production service worker smoke', () => {
  test.beforeEach(async ({ page }) => {
    await declineWelcomeAudio(page);
  });

  test('refreshes same-path runtime assets after a simulated redeploy', async ({ page }) => {
    const deployment = await createTemporaryDeployment();
    const probeUrl = new URL(PROBE_ASSET_PATH, `${deployment.url}/`).toString();
    const originalAsset = await readFile(deployment.assetPath);

    try {
      await page.goto(deployment.url, { waitUntil: 'load' });
      await expect(page.locator('#main-content')).toBeVisible();

      await ensureServiceWorkerControlsPage(page);

      const initialProbe = await readProbeMetrics(page, probeUrl);
      expect(initialProbe.naturalWidth).toBeGreaterThan(1);
      expect(initialProbe.naturalHeight).toBeGreaterThan(1);
      expect(initialProbe.cached).toBe(true);
      expect(initialProbe.cachedSize).not.toBeNull();

      const replacementAsset = await createReplacementJpeg(page);
      await writeFile(deployment.assetPath, replacementAsset);

      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('#main-content')).toBeVisible();

      const refreshedProbe = await readProbeMetrics(page, probeUrl);
      expect(refreshedProbe.naturalWidth).toBe(1);
      expect(refreshedProbe.naturalHeight).toBe(1);
      expect(refreshedProbe.cached).toBe(true);
      expect(refreshedProbe.cachedSize).not.toBeNull();
      expect(refreshedProbe.cachedSize).toBeLessThan(
        initialProbe.cachedSize ?? Number.MAX_SAFE_INTEGER
      );
    } finally {
      await writeFile(deployment.assetPath, originalAsset);
      await disposeTemporaryDeployment(deployment);
    }
  });

  test('boots the client router when a controlled deep link reload gets a host 404', async ({
    page,
  }) => {
    const deployment = await createTemporaryDeployment({ rewriteNavigations: false });
    const cvUrl = new URL('/cv', `${deployment.url}/`).toString();

    try {
      await page.goto(deployment.url, { waitUntil: 'load' });
      await expect(page.locator('#main-content')).toBeVisible();

      await ensureServiceWorkerControlsPage(page);

      await page.goto(cvUrl, { waitUntil: 'load' });
      await expect(page).toHaveURL(cvUrl);
      await expect(page.locator('#main-content')).toBeVisible();
      await expect(page.getByText('Daniel Henderson')).toBeVisible();
      await expect(page.getByText('MS in Applied/Computational Math')).toBeVisible();
    } finally {
      await disposeTemporaryDeployment(deployment);
    }
  });
});
