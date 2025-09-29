/**
 * Production Service Worker with Advanced Cache Busting
 * Implements the most effective strategies from the investigation
 */

// Configuration
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `production-cache-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;
const API_CACHE_NAME = `api-${CACHE_VERSION}`;

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/production/CacheBustingManager.js',
  '/manifest.json'
];

// Cache busting configuration
const CACHE_BUSTING_CONFIG = {
  enabled: true,
  strategies: {
    versionBump: true,
    signatureInvalidation: true,
    conditionalBypass: true,
    staleWhileRevalidate: true
  },
  updateCheckInterval: 30000, // 30 seconds
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  staleWhileRevalidateTime: 5 * 60 * 1000 // 5 minutes
};

// Install event - cache static files with version bumping
self.addEventListener('install', (event) => {
  console.log('🔧 Production service worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching static files with version bumping...');
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

// Activate event - clean up old caches and implement cache busting
self.addEventListener('activate', (event) => {
  console.log('🚀 Production service worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
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
      .then(() => {
        // Start cache busting strategies
        if (CACHE_BUSTING_CONFIG.enabled) {
          startCacheBustingStrategies();
        }
      })
  );
});

// Fetch event - implement advanced cache strategies
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
  
  // Apply cache busting strategies based on request type
  if (request.url.includes('/api/')) {
    // API requests - use network-first with cache busting
    event.respondWith(handleApiRequestWithCacheBusting(request));
  } else if (request.url.includes('/assets/') || request.url.includes('.js') || request.url.includes('.css')) {
    // Static assets - use cache-first with signature invalidation
    event.respondWith(handleAssetRequestWithSignatureInvalidation(request));
  } else if (request.url.includes('?v=') || request.url.includes('?cb=') || request.url.includes('?h=')) {
    // Versioned requests - use stale-while-revalidate with conditional bypass
    event.respondWith(handleVersionedRequestWithConditionalBypass(request));
  } else {
    // Default - use stale-while-revalidate
    event.respondWith(handleDefaultRequestWithStaleWhileRevalidate(request));
  }
});

// Handle API requests with network-first strategy and cache busting
async function handleApiRequestWithCacheBusting(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Always try network first for API requests
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Cache-Bust': Date.now().toString()
      }
    });
    
    if (networkResponse.ok) {
      // Cache the response with timestamp
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Fall back to cache if network fails
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is stale
      const cacheTimestamp = cachedResponse.headers.get('X-Cache-Timestamp');
      if (cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) > CACHE_BUSTING_CONFIG.maxCacheAge) {
        // Cache is stale, try to refresh in background
        refreshCacheInBackground(request, cache);
      }
      
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle asset requests with cache-first strategy and signature invalidation
async function handleAssetRequestWithSignatureInvalidation(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if we need to invalidate cache based on signature
    const shouldInvalidate = await shouldInvalidateCache(request, cachedResponse);
    
    if (!shouldInvalidate) {
      return cachedResponse;
    }
  }
  
  try {
    // Fetch from network with cache busting
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Signature': generateSignature(request.url)
      }
    });
    
    if (networkResponse.ok) {
      // Cache with signature
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Signature', generateSignature(request.url));
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached response if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle versioned requests with stale-while-revalidate and conditional bypass
async function handleVersionedRequestWithConditionalBypass(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update cache in background with conditional bypass
    updateCacheInBackgroundWithConditionalBypass(request, cache);
    return cachedResponse;
  }
  
  // No cached response, fetch from network
  try {
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Conditional-Bypass': 'true',
        'X-Cache-Bust': Date.now().toString()
      }
    });
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      responseToCache.headers.set('X-Conditional-Bypass', 'true');
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Handle default requests with stale-while-revalidate
async function handleDefaultRequestWithStaleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is stale
    const cacheTimestamp = cachedResponse.headers.get('X-Cache-Timestamp');
    const isStale = cacheTimestamp && 
      (Date.now() - parseInt(cacheTimestamp)) > CACHE_BUSTING_CONFIG.staleWhileRevalidateTime;
    
    if (isStale) {
      // Update cache in background
      updateCacheInBackground(request, cache);
    }
    
    return cachedResponse;
  }
  
  // No cached response, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Cache busting helper functions

async function shouldInvalidateCache(request, cachedResponse) {
  // Check if cache should be invalidated based on signature
  const cachedSignature = cachedResponse.headers.get('X-Signature');
  const currentSignature = generateSignature(request.url);
  
  return cachedSignature !== currentSignature;
}

function generateSignature(url) {
  // Generate a signature based on URL and current time
  // In production, this would be more sophisticated
  return `${url}_${Math.floor(Date.now() / (5 * 60 * 1000))}`; // 5-minute intervals
}

async function refreshCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      cache.put(request, responseToCache);
    }
  } catch (error) {
    // Ignore background refresh errors
    console.warn('Background cache refresh failed:', error);
  }
}

async function updateCacheInBackgroundWithConditionalBypass(request, cache) {
  try {
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Conditional-Bypass': 'true',
        'X-Cache-Bust': Date.now().toString()
      }
    });
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      responseToCache.headers.set('X-Conditional-Bypass', 'true');
      cache.put(request, responseToCache);
    }
  } catch (error) {
    // Ignore background update errors
    console.warn('Background cache update with conditional bypass failed:', error);
  }
}

async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('X-Cache-Timestamp', Date.now().toString());
      cache.put(request, responseToCache);
    }
  } catch (error) {
    // Ignore background update errors
    console.warn('Background cache update failed:', error);
  }
}

// Start cache busting strategies
function startCacheBustingStrategies() {
  console.log('🚀 Starting cache busting strategies...');
  
  // Periodic cache invalidation
  setInterval(async () => {
    await performPeriodicCacheInvalidation();
  }, CACHE_BUSTING_CONFIG.updateCheckInterval);
  
  // Periodic signature invalidation
  setInterval(async () => {
    await performPeriodicSignatureInvalidation();
  }, CACHE_BUSTING_CONFIG.updateCheckInterval * 2);
}

// Perform periodic cache invalidation
async function performPeriodicCacheInvalidation() {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        const cacheTimestamp = response.headers.get('X-Cache-Timestamp');
        
        if (cacheTimestamp && 
            (Date.now() - parseInt(cacheTimestamp)) > CACHE_BUSTING_CONFIG.maxCacheAge) {
          // Cache entry is too old, delete it
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.warn('Periodic cache invalidation failed:', error);
  }
}

// Perform periodic signature invalidation
async function performPeriodicSignatureInvalidation() {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        const cachedSignature = response.headers.get('X-Signature');
        const currentSignature = generateSignature(request.url);
        
        if (cachedSignature && cachedSignature !== currentSignature) {
          // Signature has changed, delete cache entry
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.warn('Periodic signature invalidation failed:', error);
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
      
    case 'INVALIDATE_CACHE':
      invalidateCache(data.url).then(() => {
        event.ports[0].postMessage({ type: 'CACHE_INVALIDATED', data: { url: data.url } });
      });
      break;
      
    case 'UPDATE_CACHE_SIGNATURES':
      updateCacheSignatures(data.signatures).then(() => {
        event.ports[0].postMessage({ type: 'CACHE_SIGNATURES_UPDATED' });
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

// Invalidate specific cache entry
async function invalidateCache(url) {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    await cache.delete(url);
  }
}

// Update cache signatures
async function updateCacheSignatures(signatures) {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const newResponse = response.clone();
        newResponse.headers.set('X-Signature', signatures[request.url] || generateSignature(request.url));
        newResponse.headers.set('X-Cache-Timestamp', Date.now().toString());
        await cache.put(request, newResponse);
      }
    }
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
            timestamp: Date.now(),
            cacheBustingEnabled: CACHE_BUSTING_CONFIG.enabled
          }
        });
      });
    });
  });
}, 30000); // Send every 30 seconds