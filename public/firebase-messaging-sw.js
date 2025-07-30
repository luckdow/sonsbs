// Firebase Messaging Service Worker - Background Notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase Config (same as main app)
const firebaseConfig = {
  apiKey: "AIzaSyB6903uKvs3vjCkfreIvzensUFa25wVB9c",
  authDomain: "sbs-travel-96d0b.firebaseapp.com",
  projectId: "sbs-travel-96d0b",
  storageBucket: "sbs-travel-96d0b.firebasestorage.app",
  messagingSenderId: "689333443277",
  appId: "1:689333443277:web:d26c455760eb28a41e6784"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

console.log('🔔 Firebase Messaging SW: Background notifications aktif');

// Background message handler - Browser kapalıyken çalışır
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'SBS Transfer';
  const notificationOptions = {
    body: payload.notification?.body || 'Yeni bildirim',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `sbs-${Date.now()}`,
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Aç'
      },
      {
        action: 'close',
        title: 'Kapat'
      }
    ],
    data: {
      url: payload.data?.url || '/admin',
      reservationId: payload.data?.reservationId,
      type: payload.data?.type || 'general'
    }
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/admin/reservations';
  
  // Rezervasyon bildirimi ise doğrudan rezervasyonlar sayfasına git
  if (event.notification.data?.type === 'new_reservation') {
    urlToOpen = '/admin/reservations';
  }
  
  // Open/focus the app
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Eğer zaten açık bir window varsa, onu focus et
      for (const client of clientList) {
        if (client.url.includes(window.location.hostname) && 'focus' in client) {
          client.focus();
          client.navigate(urlToOpen);
          return;
        }
      }
      
      // Yoksa yeni window aç
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Service Worker lifecycle
self.addEventListener('install', (event) => {
  console.log('🔔 Firebase SW: Install event');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🔔 Firebase SW: Activate event');
  event.waitUntil(self.clients.claim());
});
