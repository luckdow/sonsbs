// Firebase Messaging Service Worker - GEÇİCİ OLARAK DEVRE DIŞI
// PWA sorunları nedeniyle geçici olarak devre dışı bırakıldı

console.log('Firebase Messaging SW - Geçici olarak devre dışı');

// Basit service worker kayıt etme
self.addEventListener('install', (event) => {
  console.log('Firebase SW: Install event');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Firebase SW: Activate event');
  event.waitUntil(self.clients.claim());
});

// Push event'leri devre dışı
self.addEventListener('push', (event) => {
  console.log('Firebase SW: Push event devre dışı');
});

self.addEventListener('notificationclick', (event) => {
  console.log('Firebase SW: Notification click devre dışı');
});

// Fetch event'leri devre dışı - sayfa donmasını önlemek için
self.addEventListener('fetch', (event) => {
  // Hiçbir şey yapma, normal fetch'e izin ver
  return;
});
