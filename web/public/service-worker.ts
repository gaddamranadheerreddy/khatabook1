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
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'khatabook-cache-v1';
const ASSETS = ['/','/index.html'];

/* =========================
   INSTALL
========================= */
self.addEventListener('install', (event: ExtendableEvent) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    self.clients.claim()
  );
});

/* =========================
   FETCH
========================= */
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

//------------3----------------

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