// Test setup for cache busting research
import { jest } from '@jest/globals';

// Mock service worker APIs
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve({
      installing: null,
      waiting: null,
      active: null,
      addEventListener: jest.fn(),
      unregister: jest.fn(() => Promise.resolve(true))
    })),
    getRegistrations: jest.fn(() => Promise.resolve([])),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  },
  writable: true
});

// Mock caches API
Object.defineProperty(window, 'caches', {
  value: {
    open: jest.fn(() => Promise.resolve({
      match: jest.fn(() => Promise.resolve(null)),
      put: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve(true)),
      keys: jest.fn(() => Promise.resolve([]))
    })),
    keys: jest.fn(() => Promise.resolve([])),
    delete: jest.fn(() => Promise.resolve(true))
  },
  writable: true
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    headers: new Map([['cache-control', 'max-age=3600']]),
    clone: jest.fn(() => ({
      ok: true,
      status: 200,
      headers: new Map([['cache-control', 'max-age=3600']])
    }))
  })
);

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => [
      {
        loadEventEnd: 1000,
        loadEventStart: 500,
        transferSize: 1024,
        decodedBodySize: 2048
      }
    ])
  },
  writable: true
});

// Mock crypto API
Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32)))
    }
  },
  writable: true
});

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  createMockRequest: (url, options = {}) => ({
    url,
    method: 'GET',
    headers: new Map(),
    ...options
  }),
  
  createMockResponse: (data, options = {}) => ({
    ok: true,
    status: 200,
    headers: new Map([['cache-control', 'max-age=3600']]),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    clone: () => global.testUtils.createMockResponse(data, options),
    ...options
  }),
  
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};