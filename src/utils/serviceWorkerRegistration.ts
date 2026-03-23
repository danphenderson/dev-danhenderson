/**
 * Minimal service worker registration for PWA installability.
 *
 * Uses the production build's built-in service worker when available.
 * Keeps caching conservative — network-first for navigation and runtime
 * assets, with cache fallback for offline use.
 */

import { readNodeEnvironment, readPublicUrl } from './appEnvironment';
import { resolvePublicAssetPath } from './assets';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    /^127(?:\.\d+){3}$/.test(window.location.hostname)
);

type ServiceWorkerConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

function registerValidSW(swUrl: string, config?: ServiceWorkerConfig) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;

        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state !== 'installed') return;

          if (navigator.serviceWorker.controller) {
            config?.onUpdate?.(registration);
          } else {
            config?.onSuccess?.(registration);
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');

      if (response.status === 404 || (contentType && !contentType.includes('javascript'))) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // Offline — service worker serves cached assets
    });
}

export function register(config?: ServiceWorkerConfig): void {
  if (readNodeEnvironment() !== 'production' || !('serviceWorker' in navigator)) {
    return;
  }

  const publicUrl = new URL(readPublicUrl(), window.location.href);

  if (publicUrl.origin !== window.location.origin) {
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = resolvePublicAssetPath('/service-worker.js', readPublicUrl());

    if (isLocalhost) {
      checkValidServiceWorker(swUrl, config);
    } else {
      registerValidSW(swUrl, config);
    }
  });
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}
