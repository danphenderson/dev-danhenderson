/* eslint-disable no-restricted-globals */

/**
 * Minimal service worker for PWA installability.
 *
 * Strategy: network-first for navigation requests and runtime assets, with
 * cache fallback for offline use. This avoids indefinitely pinning same-path
 * files across future deploys.
 */

const CACHE_NAME = 'danhenderson-v1';

const PRECACHE_URLS = ['./', './index.html'];
const RUNTIME_ASSET_DESTINATIONS = new Set(['image', 'style', 'script', 'font']);

function getCachedAppShell() {
  return caches.match('./index.html').then((cached) => {
    if (cached) {
      return cached;
    }

    throw new Error('No cached app shell available');
  });
}

function updateCache(request, response) {
  if (!response.ok) {
    return response;
  }

  const clone = response.clone();

  caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));

  return response;
}

function networkFirstWithCacheFallback(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) {
        return updateCache(request, response);
      }

      return caches.match(request).then((cached) => cached || response);
    })
    .catch(() =>
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        throw new Error(`No cached response available for ${request.url}`);
      })
    );
}

function networkFirstNavigationWithShellFallback(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok || response.status !== 404) {
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
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstNavigationWithShellFallback(event.request));
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (RUNTIME_ASSET_DESTINATIONS.has(event.request.destination)) {
    event.respondWith(networkFirstWithCacheFallback(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});
