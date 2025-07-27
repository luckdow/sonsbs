// Enhanced Service Worker for Gate Transfer PWA
// Combines Firebase messaging with advanced caching and offline functionality

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Cache configuration
const CACHE_NAME = 'gate-transfer-v2.0';
const OFFLINE_CACHE = 'gate-transfer-offline-v1.0';
const RUNTIME_CACHE = 'gate-transfer-runtime-v1.0';

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/images/icon-192.png',
  '/images/icon-512.png',
  // Critical CSS and JS will be added dynamically
];

// Routes that should work offline
const OFFLINE_ROUTES = [
  '/',
  '/hakkimizda',
  '/iletisim',
  '/hizmetler',
  '/rezervasyon'
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/cities',
  '/api/services',
  '/api/prices'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Precache critical assets
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      }),
      
      // Create offline cache
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add('/offline.html');
      }),
      
      // Skip waiting
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== OFFLINE_CACHE && 
                cacheName !== RUNTIME_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Handle navigation requests
    if (request.mode === 'navigate') {
      event.respondWith(handleNavigationRequest(request));
    }
    // Handle API requests
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleAPIRequest(request));
    }
    // Handle static assets
    else if (request.destination === 'image' || 
             request.destination === 'script' || 
             request.destination === 'style') {
      event.respondWith(handleAssetRequest(request));
    }
    // Handle other requests
    else {
      event.respondWith(handleOtherRequest(request));
    }
  }
});

// Handle navigation requests (pages)
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📴 Network failed, serving from cache:', request.url);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page for navigation requests
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      // Notify client about offline fallback
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'OFFLINE_FALLBACK',
            url: request.url
          });
        });
      });
      
      return offlineResponse;
    }
    
    // Fallback response
    return new Response(
      '<html><body><h1>Çevrimdışı</h1><p>İnternet bağlantınızı kontrol edin.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // Check if API is cacheable
  const isCacheable = CACHEABLE_APIS.some(api => url.pathname.startsWith(api));
  
  if (isCacheable) {
    try {
      // Try network first
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful API responses
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
    } catch (error) {
      console.log('API network failed, trying cache:', request.url);
    }
    
    // Try cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // For non-cacheable APIs or cache miss, try network
  try {
    return await fetch(request);
  } catch (error) {
    // Return offline API response
    return new Response(
      JSON.stringify({ 
        error: 'Çevrimdışı modu', 
        message: 'Bu işlem için internet bağlantısı gerekli' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static asset requests
async function handleAssetRequest(request) {
  // Try cache first for assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache assets
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Asset network failed:', request.url);
    
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Resim Yüklenemedi</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Handle other requests
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Message handler from client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        event.ports[0].postMessage(status);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CONNECTIVITY_RESTORED':
      handleConnectivityRestored();
      break;
  }
});

// Get cache status
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    cacheInfo[cacheName] = keys.length;
  }
  
  return cacheInfo;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );
}

// Handle connectivity restored
function handleConnectivityRestored() {
  // Sync pending data, refresh caches, etc.
  console.log('🌐 Connectivity restored - syncing data');
  
  // Notify all clients
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'CONNECTIVITY_RESTORED'
      });
    });
  });
}

// Firebase background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Background message received:', payload);
  
  const { title, body, icon } = payload.notification || {};
  const { reservationId, type, url } = payload.data || {};
  
  const notificationOptions = {
    body: body || 'Gate Transfer bildirim',
    icon: icon || '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: `reservation-${reservationId || Date.now()}`,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Görüntüle',
        icon: '/images/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Kapat'
      }
    ],
    data: {
      reservationId,
      type,
      url: url || '/'
    }
  };
  
  return self.registration.showNotification(
    title || 'Gate Transfer',
    notificationOptions
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  const { url = '/', reservationId, type } = data || {};
  
  if (action === 'view' || !action) {
    // Open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
});

// Background sync (for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline data when connection is restored
  console.log('🔄 Background sync triggered');
}
