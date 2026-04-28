const CACHE = 'orban-guide-v39';
const ASSETS = [
  '/',
  '/index.html',
  '/orban-logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try the network, fall back to cache when offline
self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Update cache with fresh response
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
