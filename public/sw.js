// Basic Service Worker for SBS Transfer
// Version: 1.0

const CACHE_NAME = 'sbs-transfer-v1';
const urlsToCache = [
  '/',
  '/src/main.jsx',
  '/src/index.css',
  '/images/hero-antalya-transfer.webp',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Google APIs and external resources
  if (event.request.url.includes('googleapis.com') || 
      event.request.url.includes('google.com') ||
      event.request.url.includes('googletagmanager.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Push notification handling (placeholder)
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  // Implement push notification logic if needed
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  event.notification.close();
  // Handle notification click
});
