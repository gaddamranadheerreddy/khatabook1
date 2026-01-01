// self.addEventListener('install', () => {
//   self.skipWaiting();
// });

// self.addEventListener('fetch', () => {
//   // passive offline support (expand later)
// });


// / <reference lib="webworker" />

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // passive fetch – no caching yet
});
