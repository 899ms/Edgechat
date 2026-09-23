// Edgechat minimal service worker.
// Purpose: satisfy the PWA installability requirement so Chrome/Edge show the
// install button in the address bar. It intentionally does NOT cache anything
// and does NOT intercept API, /files, or WebSocket traffic — every request is
// passed straight through to the network.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Never touch non-GET requests (PUT/POST/DELETE, WebSocket upgrades, etc.).
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Only same-origin static asset requests are eligible; everything else
  // (API, uploads, cross-origin) falls through to the browser default.
  if (url.origin !== self.location.origin) {
    return;
  }
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/files')) {
    return;
  }

  // Pass-through response; no caching, so nothing goes stale.
  event.respondWith(fetch(request));
});
