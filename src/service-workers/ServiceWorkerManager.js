/**
 * ServiceWorkerManager - Manages service worker registration and cache strategies
 */
export class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.status = 'unregistered';
    this.cacheStrategies = {
      'cache-first': this.cacheFirstStrategy.bind(this),
      'network-first': this.networkFirstStrategy.bind(this),
      'stale-while-revalidate': this.staleWhileRevalidateStrategy.bind(this),
      'network-only': this.networkOnlyStrategy.bind(this),
      'cache-only': this.cacheOnlyStrategy.bind(this)
    };
  }

  /**
   * Register service worker
   */
  async register() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      this.status = 'registered';
      console.log('✅ Service worker registered successfully');

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event);
      });

      return true;
    } catch (error) {
      this.status = 'error';
      console.error('❌ Service worker registration failed:', error);
      return false;
    }
  }

  /**
   * Handle service worker updates
   */
  handleUpdate() {
    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New content is available
          this.status = 'updated';
          this.notifyUpdate();
        } else {
          // Content is cached for the first time
          this.status = 'cached';
        }
      }
    });
  }

  /**
   * Handle messages from service worker
   */
  handleMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'CACHE_UPDATED':
        console.log('📦 Cache updated:', data);
        break;
      case 'PERFORMANCE_METRICS':
        console.log('📊 Performance metrics:', data);
        break;
      case 'ERROR':
        console.error('❌ Service worker error:', data);
        break;
    }
  }

  /**
   * Notify about updates
   */
  notifyUpdate() {
    // Dispatch custom event for update notification
    window.dispatchEvent(new CustomEvent('sw-update', {
      detail: { registration: this.registration }
    }));
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.status;
  }

  /**
   * Clear all caches
   */
  async clearCaches() {
    if (!('caches' in window)) {
      return;
    }

    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );

    console.log('✅ All caches cleared');
  }

  /**
   * Test different cache strategies
   */
  async testCacheStrategy(strategyName, url) {
    const strategy = this.cacheStrategies[strategyName];
    if (!strategy) {
      throw new Error(`Unknown cache strategy: ${strategyName}`);
    }

    return await strategy(url);
  }

  /**
   * Cache-first strategy
   */
  async cacheFirstStrategy(url) {
    const cache = await caches.open('cache-first');
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(url);
    cache.put(url, networkResponse.clone());
    return networkResponse;
  }

  /**
   * Network-first strategy
   */
  async networkFirstStrategy(url) {
    try {
      const networkResponse = await fetch(url);
      const cache = await caches.open('network-first');
      cache.put(url, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      const cache = await caches.open('network-first');
      const cachedResponse = await cache.match(url);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      throw error;
    }
  }

  /**
   * Stale-while-revalidate strategy
   */
  async staleWhileRevalidateStrategy(url) {
    const cache = await caches.open('stale-while-revalidate');
    const cachedResponse = await cache.match(url);
    
    // Return cached response immediately
    if (cachedResponse) {
      // Update cache in background
      fetch(url).then(response => {
        cache.put(url, response.clone());
      }).catch(() => {
        // Ignore network errors for background update
      });
      
      return cachedResponse;
    }
    
    // No cached response, fetch from network
    const networkResponse = await fetch(url);
    cache.put(url, networkResponse.clone());
    return networkResponse;
  }

  /**
   * Network-only strategy
   */
  async networkOnlyStrategy(url) {
    return await fetch(url);
  }

  /**
   * Cache-only strategy
   */
  async cacheOnlyStrategy(url) {
    const cache = await caches.open('cache-only');
    const cachedResponse = await cache.match(url);
    
    if (!cachedResponse) {
      throw new Error('No cached response available');
    }
    
    return cachedResponse;
  }

  /**
   * Add event listener for updates
   */
  onUpdate(callback) {
    window.addEventListener('sw-update', callback);
  }

  /**
   * Unregister service worker
   */
  async unregister() {
    if (this.registration) {
      await this.registration.unregister();
      this.status = 'unregistered';
      console.log('✅ Service worker unregistered');
    }
  }
}