const CACHE_NAME = 'axim-pwa-cache-v1';

const EXCLUDED_URLS = [
  '/api/',
  '/auth/',
  'supabase.co'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (EXCLUDED_URLS.some(excluded => url.includes(excluded))) {
    return; // Let the browser handle the fetch, no caching
  }

  // Simple pass-through (Network First)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
