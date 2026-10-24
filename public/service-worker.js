/* eslint-disable no-restricted-globals */

/**
 * Minimal service worker for PWA installability.
 *
 * Strategy: network-first for navigation requests and runtime assets, with
 * cache fallback for offline use. This avoids indefinitely pinning same-path
 * files across future deploys.
 */

const CACHE_NAME = 'danhenderson-v3';
const IMAGE_CACHE_NAME = `${CACHE_NAME}-display-images`;
const MAX_DISPLAY_IMAGES = 48;
const MAX_IMAGE_BYTES = 1_000_000;
const MAX_RUNTIME_ASSETS = 128;
let cacheWrites = Promise.resolve();

const PRECACHE_URLS = ['./', './index.html'];
const RUNTIME_ASSET_DESTINATIONS = new Set(['image', 'style', 'script', 'font']);

function createUnavailableResponse(statusText, status = 503) {
  return new Response(statusText, {
    status,
    statusText,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

function getCachedAppShell() {
  return caches
    .match('./index.html')
    .then((cached) => cached || createUnavailableResponse('Offline'));
}

function updateCache(event, response) {
  if (response.status !== 200) return response;
  const { request } = event;
  const isImage = request.destination === 'image';
  const clone = response.clone();
  // Serialize writes so concurrent image loads cannot escape the entry bound.
  cacheWrites = cacheWrites.then(async () => {
    try {
      if (isImage && (await clone.clone().blob()).size > MAX_IMAGE_BYTES) return;
      const cache = await caches.open(isImage ? IMAGE_CACHE_NAME : CACHE_NAME);
      await cache.put(request, clone);
      const keys = (await cache.keys()).filter(
        (key) => !PRECACHE_URLS.some((url) => new URL(url, self.location.href).href === key.url)
      );
      const limit = isImage ? MAX_DISPLAY_IMAGES : MAX_RUNTIME_ASSETS;
      for (const key of keys.slice(0, Math.max(0, keys.length - limit))) {
        await cache.delete(key);
      }
    } catch {
      // Quota/storage failures must never discard a successful network response.
    }
  });
  // Keep the worker alive for the write without making the page wait for storage.
  event.waitUntil(cacheWrites);
  return response;
}

function isUsableAssetResponse(request, response) {
  return (
    response &&
    response.ok &&
    (request.destination !== 'image' ||
      /^image\//i.test(response.headers.get('Content-Type') || ''))
  );
}

function getCachedAsset(request) {
  return caches
    .match(request)
    .then((cached) => (isUsableAssetResponse(request, cached) ? cached : undefined));
}

function networkFirstWithCacheFallback(event) {
  const { request } = event;
  return fetch(request)
    .then((response) => {
      if (isUsableAssetResponse(request, response)) {
        return updateCache(event, response);
      }

      return getCachedAsset(request).then(
        (cached) =>
          cached ||
          (response.ok ? createUnavailableResponse('Invalid image response', 502) : response)
      );
    })
    .catch(() =>
      getCachedAsset(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return createUnavailableResponse('Service Unavailable');
      })
    );
}

function networkFirstNavigationWithShellFallback(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        return response;
      }

      return getCachedAppShell();
    })
    .catch(() => getCachedAppShell());
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith('danhenderson-') && name !== CACHE_NAME && name !== IMAGE_CACHE_NAME
            )
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.headers.has('Range')) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const scopePath = new URL('./', self.location.href).pathname;

  if (
    requestUrl.origin !== self.location.origin ||
    !requestUrl.pathname.startsWith(scopePath)
  ) {
    return;
  }

  if (event.request.mode === 'navigate') {
    const relativePath = requestUrl.pathname.slice(scopePath.length);
    // Native PDF viewers and file links must never receive the SPA shell.
    const isFile = relativePath.startsWith('assets/') || /\/?[^/]+\.[^/]+\/?$/.test(relativePath);
    if (!isFile || relativePath === 'index.html') {
      event.respondWith(networkFirstNavigationWithShellFallback(event.request));
    }
    return;
  }

  // Keep original photography and duplicate query variants out of runtime storage.
  if (
    event.request.destination === 'image' &&
    (requestUrl.search || !requestUrl.pathname.includes('/assets/display/'))
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (RUNTIME_ASSET_DESTINATIONS.has(event.request.destination)) {
    event.respondWith(networkFirstWithCacheFallback(event));
    return;
  }

  event.respondWith(fetch(event.request));
});
