/**
 * Caches API Mock for Node.js Environment
 * Provides a mock implementation of the caches API for testing in Node.js
 */

class CacheMock {
  constructor(name) {
    this.name = name;
    this.entries = new Map();
  }

  async keys() {
    return Array.from(this.entries.keys());
  }

  async match(request) {
    const url = typeof request === 'string' ? request : request.url;
    return this.entries.get(url) || null;
  }

  async put(request, response) {
    const url = typeof request === 'string' ? request : request.url;
    this.entries.set(url, response);
  }

  async delete(request) {
    const url = typeof request === 'string' ? request : request.url;
    return this.entries.delete(url);
  }

  async addAll(requests) {
    for (const request of requests) {
      const url = typeof request === 'string' ? request : request.url;
      const response = new Response('Mock response', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'max-age=3600',
          'ETag': `"mock-${Date.now()}"`,
          'Last-Modified': new Date().toUTCString()
        }
      });
      this.entries.set(url, response);
    }
  }
}

class CachesMock {
  constructor() {
    this.caches = new Map();
  }

  async open(name) {
    if (!this.caches.has(name)) {
      this.caches.set(name, new CacheMock(name));
    }
    return this.caches.get(name);
  }

  async keys() {
    return Array.from(this.caches.keys());
  }

  async delete(name) {
    return this.caches.delete(name);
  }

  async has(name) {
    return this.caches.has(name);
  }

  async match(request) {
    for (const cache of this.caches.values()) {
      const response = await cache.match(request);
      if (response) {
        return response;
      }
    }
    return null;
  }
}

// Mock the global caches API if not available
if (typeof global !== 'undefined' && !global.caches) {
  global.caches = new CachesMock();
}

// Mock the global caches API if not available in window
if (typeof window !== 'undefined' && !window.caches) {
  window.caches = new CachesMock();
}

export { CachesMock, CacheMock };