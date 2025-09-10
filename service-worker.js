// service-worker.js
const CACHE_NAME = 'field-ops-v1';
const OFFLINE_URL = '/offline.html';

// List all critical files you want cached for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  OFFLINE_URL
];

// Install event – pre-cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});

// Fetch event – serve from cache first, fallback to offline page
self.addEventListener('fetch', event => {
  // Fix for preload response issue
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          return await fetch(event.request);
        } catch (error) {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return await caches.match(OFFLINE_URL);
        }
      })()
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).catch(() => {
          return caches.match(OFFLINE_URL);
        });
      })
    );
  }
});
