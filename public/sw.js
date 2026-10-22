const CACHE_NAME = "axim-pwa-cache-v2";
const STATIC_ASSETS = [
  "/",
  "/education"
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
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
