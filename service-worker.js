const CACHE_NAME = 'gathr-v3-cache';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './css/index.css',
  './css/components.css',
  './css/ticket.css',
  './css/scanner.css',
  './css/organizer.css',
  './css/radar.css',
  './css/wizard.css',
  './css/admin.css',
  './css/planning.css',
  './js/events-data.js',
  './js/ticket-engine.js',
  './js/scanner.js',
  './js/organizer.js',
  './js/planning.js',
  './js/radar.js',
  './js/wizard.js',
  './js/admin.js',
  './js/app.js',
  './assets/manifest.json',
  './assets/images/logo.png',
  './assets/images/logo-cinematic.png',
  './assets/images/tech-summit.jpg',
  './assets/images/beach-fest.jpg',
  './assets/images/founders-gala.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch((err) => console.log('SW cache partial failure:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
