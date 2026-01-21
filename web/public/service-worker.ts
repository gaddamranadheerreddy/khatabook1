// self.addEventListener('install', () => {
//   self.skipWaiting();
// });

// self.addEventListener('fetch', () => {
//   // passive offline support (expand later)
// });

//----------------1-------------

//------------2------------------

// / <reference lib="webworker" />

// self.addEventListener('install', (event) => {
//   self.skipWaiting();
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener('fetch', (event) => {
//   // passive fetch – no caching yet
// });

//-----------2----------------

//------------3-------------
// /// <reference lib="webworker" />

// declare const self: ServiceWorkerGlobalScope;

// const CACHE_NAME = 'khatabook-cache-v1';
// const ASSETS = ['/','/index.html'];

// /* =========================
//    INSTALL
// ========================= */
// self.addEventListener('install', (event: ExtendableEvent) => {
//   self.skipWaiting();

//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
//   );
// });

// /* =========================
//    ACTIVATE
// ========================= */
// self.addEventListener('activate', (event: ExtendableEvent) => {
//   event.waitUntil(
//     self.clients.claim()
//   );
// });

// /* =========================
//    FETCH
// ========================= */
// self.addEventListener('fetch', (event: FetchEvent) => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });

//------------3----------------

//-------5-------------------
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'mykhata-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
];

/* Install - cache static assets */
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* Activate - clean up old caches */
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

/* Fetch - network first, fallback to cache */
self.addEventListener('fetch', (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Google API requests (for Drive backup)
  if (event.request.url.includes('googleapis.com')) return;
  if (event.request.url.includes('accounts.google.com')) return;

  event.respondWith((async (): Promise<Response> => {
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const responseClone = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, responseClone);
      }
      return response;
    } catch {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      if (event.request.mode === 'navigate') {
        const home = await caches.match('/');
        return home ?? new Response('Offline', { status: 503 });
      }
      return new Response('Offline', { status: 503 });
    }
  })());
});

export {};

//--------------5------------------

//-------4-------------------
// /// <reference lib="webworker" />

// export {};

// declare const self: ServiceWorkerGlobalScope;

// /* =========================
//    INSTALL
// ========================= */
// self.addEventListener('install', (event) => {
//   self.skipWaiting();
// });

// /* =========================
//    ACTIVATE
// ========================= */
// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim());
// });

// /* =========================
//    FETCH (basic shell cache)
// ========================= */
// self.addEventListener('fetch', (event) => {
//   // For now: let network handle it
// });

//----------------4-------------
