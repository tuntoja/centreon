import { registerRoute } from 'workbox-routing';
import { CacheOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { skipWaiting, clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import * as navigationPreload from 'workbox-navigation-preload';

skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

const manifest = self.__WB_MANIFEST
// precacheAndRoute(toto);
console.log('Manifest', JSON.stringify(manifest, null, 2))

navigationPreload.enable();

registerRoute(
  (params) => {
    console.log('-------------- START MATCH')
    console.log(params)
    const { url } = params
    console.log(url.toString())
    console.log('-------------- END MATCH')
    return true
    return /.(js|css|jpg|svg|png)$/.test(url.toString())
  },
  new CacheOnly({
    cacheName: 'centreon',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
      }),
    ],
  })
);