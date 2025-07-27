// Enhanced Service Worker - GEÇİCİ OLARAK DEVRE DIŞI
// PWA sorunları nedeniyle geçici olarak devre dışı bırakıldı

console.log('Enhanced SW - Geçici olarak devre dışı');

// Minimal service worker
self.addEventListener('install', (event) => {
  console.log('Enhanced SW: Install event');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Enhanced SW: Activate event');
  event.waitUntil(self.clients.claim());
});

// Fetch olaylarını engelleme - sayfa donmalarını önlemek için
self.addEventListener('fetch', (event) => {
  // Hiçbir şey yapma, normal fetch'e izin ver
  return;
});
