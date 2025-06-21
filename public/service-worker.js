// // Names of the caches used in this version of the service worker.
// const CACHE_NAME = 'granai-cache-v1';

// // List of URLs to cache during the install event.
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/favicon.ico',
//   '/logo192.png',
//   '/logo512.png',
//   '/manifest.json',
//   '/static/js/bundle.js',
//   '/static/js/main.chunk.js',
//   '/static/js/0.chunk.js',
//   // Add other static assets or files you want to cache here
// ];

// // Install event - cache files
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log('Opened cache');
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// // Activate event - clean up old caches
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log('Deleting old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });

// // Fetch event - serve cached content when offline
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Cache hit - return response
//       if (response) {
//         return response;
//       }
//       // Clone the request to fetch and cache
//       const fetchRequest = event.request.clone();
//       return fetch(fetchRequest).then((response) => {
//         // Check if valid response
//         if (
//           !response ||
//           response.status !== 200 ||
//           response.type !== 'basic'
//         ) {
//           return response;
//         }
//         // Clone response to cache
//         const responseToCache = response.clone();
//         caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, responseToCache);
//         });
//         return response;
//       });
//     })
//   );
// });
