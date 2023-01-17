import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import * as navigationPreload from 'workbox-navigation-preload';

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

navigationPreload.enable();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.update();
  });
}

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
});

console.log('Service worker installed.');

registerRoute(
  new RegExp('.*\\.js'),
  new CacheFirst({
    cacheName: 'centreon-static-v1',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 5 * 60 * 60, // 5 hours
      }),
    ],
  })
);