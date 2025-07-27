// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784",
  measurementId: "G-G4FRHCJEDP"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background mesajları dinle
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Background mesaj alındı:', payload);
  
  const { title, body, icon } = payload.notification || {};
  const { reservationId, type } = payload.data || {};
  
  // Notification seçenekleri
  const notificationOptions = {
    body: body || 'Yeni bildirim var',
    icon: icon || '/logo192.png',
    badge: '/logo192.png',
    tag: `sbs-${type || 'general'}-${reservationId || Date.now()}`,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Görüntüle',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Kapat',
        icon: '/icons/close.png'
      }
    ],
    data: {
      url: `/admin/rezervasyonlar${reservationId ? `?id=${reservationId}` : ''}`,
      type: type || 'general',
      reservationId: reservationId || null,
      timestamp: Date.now()
    }
  };

  // Notification göster
  return self.registration.showNotification(
    title || 'SBS Transfer Yönetim',
    notificationOptions
  );
});

// Notification tıklama olayını dinle
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification tıklandı:', event);
  
  event.notification.close();
  
  const { action } = event;
  const { url, type, reservationId } = event.notification.data || {};
  
  if (action === 'dismiss') {
    return;
  }
  
  // Varsayılan aksiyon veya 'view' aksiyonu
  if (action === 'view' || !action) {
    const targetUrl = url || '/admin/dashboard';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Açık admin paneli var mı kontrol et
          for (let client of clientList) {
            if (client.url.includes('/admin') && 'focus' in client) {
              // Admin paneli zaten açık, odaklan ve URL'i güncelle
              client.navigate(targetUrl);
              return client.focus();
            }
          }
          
          // Admin paneli açık değil, yeni pencere aç
          if (clients.openWindow) {
            return clients.openWindow(targetUrl);
          }
        })
    );
  }
});

// Service Worker kurulum
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker kuruldu');
  self.skipWaiting();
  
  // Cache stratejisi - static assetleri cache'le
  event.waitUntil(
    caches.open('sbs-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/logo192.png'
      ]).catch((error) => {
        console.log('Cache add failed:', error);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker aktif');
  event.waitUntil(self.clients.claim());
});

// Network isteklerini yakala ve SPA routing için fallback ekle
self.addEventListener('fetch', (event) => {
  // Sadece navigation istekleri için
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Network başarısız olursa, cache'den index.html'i serve et
          return caches.match('/') || caches.match('/index.html');
        })
    );
  }
  // Diğer istekler için normal cache-first stratejisi
  else if (event.request.destination === 'script' || 
           event.request.destination === 'style' ||
           event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache'de varsa cache'den döndür, yoksa network'ten al
          return response || fetch(event.request);
        })
    );
  }
});
