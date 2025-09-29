import { ServiceWorkerManager } from '../src/service-workers/ServiceWorkerManager.js';

describe('ServiceWorkerManager', () => {
  let swManager;
  let mockRegistration;

  beforeEach(() => {
    swManager = new ServiceWorkerManager();
    
    mockRegistration = {
      installing: null,
      waiting: null,
      active: null,
      addEventListener: jest.fn(),
      unregister: jest.fn(() => Promise.resolve(true))
    };
    
    // Mock navigator.serviceWorker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: jest.fn(() => Promise.resolve(mockRegistration)),
        getRegistrations: jest.fn(() => Promise.resolve([])),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      },
      writable: true
    });
  });

  describe('Registration', () => {
    test('should register service worker successfully', async () => {
      const result = await swManager.register();
      
      expect(result).toBe(true);
      expect(swManager.status).toBe('registered');
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
    });

    test('should handle service worker registration failure', async () => {
      navigator.serviceWorker.register.mockRejectedValue(new Error('Registration failed'));
      
      const result = await swManager.register();
      
      expect(result).toBe(false);
      expect(swManager.status).toBe('error');
    });

    test('should handle missing service worker support', async () => {
      delete navigator.serviceWorker;
      
      const result = await swManager.register();
      
      expect(result).toBe(false);
    });
  });

  describe('Status Management', () => {
    test('should get current status', () => {
      expect(swManager.getStatus()).toBe('unregistered');
      
      swManager.status = 'registered';
      expect(swManager.getStatus()).toBe('registered');
    });
  });

  describe('Cache Strategies', () => {
    beforeEach(() => {
      // Mock caches API
      const mockCache = {
        match: jest.fn(() => Promise.resolve(null)),
        put: jest.fn(() => Promise.resolve()),
        keys: jest.fn(() => Promise.resolve([]))
      };
      
      Object.defineProperty(window, 'caches', {
        value: {
          open: jest.fn(() => Promise.resolve(mockCache)),
          keys: jest.fn(() => Promise.resolve([])),
          delete: jest.fn(() => Promise.resolve(true))
        },
        writable: true
      });
    });

    test('should test cache-first strategy', async () => {
      const mockCache = await caches.open('cache-first');
      const mockResponse = { ok: true, clone: jest.fn() };
      
      mockCache.match.mockResolvedValue(mockResponse);
      
      const result = await swManager.testCacheStrategy('cache-first', '/test-url');
      
      expect(result).toBe(mockResponse);
      expect(mockCache.match).toHaveBeenCalledWith('/test-url');
    });

    test('should test network-first strategy', async () => {
      const mockCache = await caches.open('network-first');
      const mockResponse = { ok: true, clone: jest.fn() };
      
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await swManager.testCacheStrategy('network-first', '/test-url');
      
      expect(result).toBe(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/test-url');
      expect(mockCache.put).toHaveBeenCalledWith('/test-url', mockResponse);
    });

    test('should test stale-while-revalidate strategy', async () => {
      const mockCache = await caches.open('stale-while-revalidate');
      const mockResponse = { ok: true, clone: jest.fn() };
      
      mockCache.match.mockResolvedValue(mockResponse);
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await swManager.testCacheStrategy('stale-while-revalidate', '/test-url');
      
      expect(result).toBe(mockResponse);
      expect(mockCache.match).toHaveBeenCalledWith('/test-url');
    });

    test('should test network-only strategy', async () => {
      const mockResponse = { ok: true };
      global.fetch.mockResolvedValue(mockResponse);
      
      const result = await swManager.testCacheStrategy('network-only', '/test-url');
      
      expect(result).toBe(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/test-url');
    });

    test('should test cache-only strategy', async () => {
      const mockCache = await caches.open('cache-only');
      const mockResponse = { ok: true };
      
      mockCache.match.mockResolvedValue(mockResponse);
      
      const result = await swManager.testCacheStrategy('cache-only', '/test-url');
      
      expect(result).toBe(mockResponse);
      expect(mockCache.match).toHaveBeenCalledWith('/test-url');
    });

    test('should handle unknown cache strategy', async () => {
      await expect(swManager.testCacheStrategy('unknown-strategy', '/test-url'))
        .rejects.toThrow('Unknown cache strategy: unknown-strategy');
    });
  });

  describe('Cache Management', () => {
    test('should clear all caches', async () => {
      const mockCacheNames = ['cache1', 'cache2'];
      const mockDelete = jest.fn(() => Promise.resolve(true));
      
      Object.defineProperty(window, 'caches', {
        value: {
          keys: jest.fn(() => Promise.resolve(mockCacheNames)),
          delete: mockDelete
        },
        writable: true
      });
      
      await swManager.clearCaches();
      
      expect(mockDelete).toHaveBeenCalledWith('cache1');
      expect(mockDelete).toHaveBeenCalledWith('cache2');
    });

    test('should handle missing caches API', async () => {
      delete window.caches;
      
      await expect(swManager.clearCaches()).resolves.not.toThrow();
    });
  });

  describe('Event Handling', () => {
    test('should handle update events', () => {
      const mockNewWorker = {
        state: 'installed',
        addEventListener: jest.fn()
      };
      
      mockRegistration.installing = mockNewWorker;
      
      swManager.handleUpdate();
      
      expect(mockNewWorker.addEventListener).toHaveBeenCalledWith('statechange', expect.any(Function));
    });

    test('should handle messages from service worker', () => {
      const mockEvent = {
        data: {
          type: 'CACHE_UPDATED',
          data: { cacheName: 'test-cache' }
        }
      };
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      swManager.handleMessage(mockEvent);
      
      expect(consoleSpy).toHaveBeenCalledWith('📦 Cache updated:', { cacheName: 'test-cache' });
      
      consoleSpy.mockRestore();
    });

    test('should notify about updates', () => {
      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
      
      swManager.notifyUpdate();
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sw-update',
          detail: { registration: mockRegistration }
        })
      );
      
      dispatchEventSpy.mockRestore();
    });
  });

  describe('Event Listeners', () => {
    test('should add update event listener', () => {
      const callback = jest.fn();
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      swManager.onUpdate(callback);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('sw-update', callback);
      
      addEventListenerSpy.mockRestore();
    });
  });

  describe('Unregistration', () => {
    test('should unregister service worker', async () => {
      swManager.registration = mockRegistration;
      
      await swManager.unregister();
      
      expect(mockRegistration.unregister).toHaveBeenCalled();
      expect(swManager.status).toBe('unregistered');
    });

    test('should handle unregistration when no registration exists', async () => {
      swManager.registration = null;
      
      await expect(swManager.unregister()).resolves.not.toThrow();
    });
  });
});