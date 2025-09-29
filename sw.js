// Service Worker for Cache Busting Research
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cache-busting-research-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/utils/CacheBuster.js',
  '/src/utils/PerformanceMonitor.js',
  '/src/service-workers/ServiceWorkerManager.js',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle different types of requests
  if (request.url.includes('/api/')) {
    // API requests - use network-first strategy
    event.respondWith(handleApiRequest(request));
  } else if (request.url.includes('/assets/')) {
    // Static assets - use cache-first strategy
    event.respondWith(handleAssetRequest(request));
  } else if (request.url.includes('?v=') || request.url.includes('?cb=') || request.url.includes('?h=')) {
    // Versioned requests - use stale-while-revalidate
    event.respondWith(handleVersionedRequest(request));
  } else {
    // Default - use stale-while-revalidate
    event.respondWith(handleDefaultRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle asset requests with cache-first strategy
async function handleAssetRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Handle versioned requests with stale-while-revalidate
async function handleVersionedRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {
        // Ignore network errors for background update
      });
    
    return cachedResponse;
  }
  
  // No cached response, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Handle default requests with stale-while-revalidate
async function handleDefaultRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {
        // Ignore network errors for background update
      });
    
    return cachedResponse;
  }
  
  // No cached response, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage({ type: 'CACHE_INFO', data: info });
      });
      break;
      
    case 'CLEAR_CACHES':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHES_CLEARED' });
      });
      break;
      
    case 'TEST_CACHE_STRATEGY':
      testCacheStrategy(data.strategy, data.url).then(result => {
        event.ports[0].postMessage({ type: 'CACHE_STRATEGY_RESULT', data: result });
      });
      break;
  }
});

// Get cache information
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    info[cacheName] = {
      size: keys.length,
      urls: keys.map(request => request.url)
    };
  }
  
  return info;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Test cache strategy
async function testCacheStrategy(strategy, url) {
  const startTime = performance.now();
  
  try {
    let response;
    
    switch (strategy) {
      case 'cache-first':
        response = await handleAssetRequest(new Request(url));
        break;
      case 'network-first':
        response = await handleApiRequest(new Request(url));
        break;
      case 'stale-while-revalidate':
        response = await handleVersionedRequest(new Request(url));
        break;
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
    
    const endTime = performance.now();
    
    return {
      success: true,
      strategy: strategy,
      url: url,
      duration: endTime - startTime,
      cached: response.headers.get('x-cache') === 'HIT'
    };
  } catch (error) {
    const endTime = performance.now();
    
    return {
      success: false,
      strategy: strategy,
      url: url,
      duration: endTime - startTime,
      error: error.message
    };
  }
}

// Send performance metrics to main thread
setInterval(() => {
  getCacheInfo().then(info => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'PERFORMANCE_METRICS',
          metrics: {
            cacheInfo: info,
            timestamp: Date.now()
          }
        });
      });
    });
  });
}, 30000); // Send every 30 seconds