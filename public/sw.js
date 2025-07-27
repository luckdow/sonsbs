const CACHE_NAME = 'gate-transfer-v1';
const STATIC_CACHE = 'gate-transfer-static-v1';
const DYNAMIC_CACHE = 'gate-transfer-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/critical.css',
  '/manifest.json'
];

const CACHE_STRATEGIES = {
  // Cache First - for static assets
  cacheFirst: [
    /\.(?:js|css|png|jpg|jpeg|svg|gif|ico)$/,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/
  ],
  
  // Network First - for API calls and dynamic content
  networkFirst: [
    /\/api\//,
    /\/rezervasyon/,
    /\/admin/,
    /\/driver/
  ],
  
  // Stale While Revalidate - for pages
  staleWhileRevalidate: [
    /\.(?:html)$/,
    /^https:\/\/.*\.(?:html)$/
  ]
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker installing...');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  // Don't skip waiting automatically, let PWAManager control it
});

// Message listener for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event with multiple strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!url.origin.includes(self.location.origin) && !url.origin.includes('fonts.g')) {
    return;
  }

  // Determine cache strategy
  let strategy = 'networkFirst'; // default

  for (const [strategyName, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(request.url))) {
      strategy = strategyName;
      break;
    }
  }

  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Cache strategy implementations
async function handleRequest(request, strategy) {
  const cache = await caches.open(DYNAMIC_CACHE);

  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(cache, request);
    case 'networkFirst':
      return networkFirst(cache, request);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(cache, request);
    default:
      return networkFirst(cache, request);
  }
}

async function cacheFirst(cache, request) {
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, no cache available');
    return new Response('Offline content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function networkFirst(cache, request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function staleWhileRevalidate(cache, request) {
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}

// Message listener for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Listen for activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all clients immediately
      self.clients.claim(),
      
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
