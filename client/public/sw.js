// SENTINELX Self-Healing Service Worker - Zero Stale Cache Protocol
const CACHE_NAME = 'sentinelx-v3-fresh';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
  }
});

// Always bypass cache for navigation requests and index.html to guarantee current Vercel deployment
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Network-Only for HTML, main scripts, sw, manifest
  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.pathname.includes('sw.js') ||
    url.pathname.includes('manifest.json')
  ) {
    event.respondWith(
      fetch(event.request).catch((err) => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Network-First for JS and CSS assets to prevent stale hash 404s
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
