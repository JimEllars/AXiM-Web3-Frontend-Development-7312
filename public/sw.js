const CACHE_NAME = 'axim-pwa-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Only intercept same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Only intercept GET requests (never cache POST, PUT, DELETE)
  if (event.request.method !== 'GET') {
    return;
  }

  // 3. Skip API / telemetry endpoints
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 4. Safe cache-first strategy with network fallback and error guard
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch((err) => {
        console.warn('[SW] Fetch failed for:', event.request.url, err);
        // Return fallback Response or offline state rather than rejecting
        return new Response('Network unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
