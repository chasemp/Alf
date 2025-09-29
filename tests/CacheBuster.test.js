import { CacheBuster } from '../src/utils/CacheBuster.js';

describe('CacheBuster', () => {
  let cacheBuster;

  beforeEach(() => {
    cacheBuster = new CacheBuster();
  });

  describe('Strategy Testing', () => {
    test('should test timestamp strategy', async () => {
      const result = await cacheBuster.testStrategy('timestamp');
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('timestamp');
      expect(result.result.method).toBe('timestamp');
      expect(result.result.cacheBustValue).toBeDefined();
    });

    test('should test random token strategy', async () => {
      const result = await cacheBuster.testStrategy('random-token');
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('random-token');
      expect(result.result.method).toBe('random-token');
      expect(result.result.cacheBustValue).toBeDefined();
    });

    test('should test content hash strategy', async () => {
      const result = await cacheBuster.testStrategy('content-hash');
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('content-hash');
      expect(result.result.method).toBe('content-hash');
      expect(result.result.cacheBustValue).toBeDefined();
    });

    test('should test version-based strategy', async () => {
      const result = await cacheBuster.testStrategy('version-based');
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('version-based');
      expect(result.result.method).toBe('version-based');
      expect(result.result.version).toBe('1.0.0');
    });

    test('should handle unknown strategy', async () => {
      const result = await cacheBuster.testStrategy('unknown-strategy');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown strategy');
    });
  });

  describe('Token Generation', () => {
    test('should generate random token', () => {
      const token1 = cacheBuster.generateRandomToken();
      const token2 = cacheBuster.generateRandomToken();
      
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(0);
    });
  });

  describe('Content Hash Generation', () => {
    test('should generate content hash', async () => {
      const content = 'test content';
      const hash = await cacheBuster.generateContentHash(content);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA-256 hex string length
    });

    test('should generate consistent hash for same content', async () => {
      const content = 'test content';
      const hash1 = await cacheBuster.generateContentHash(content);
      const hash2 = await cacheBuster.generateContentHash(content);
      
      expect(hash1).toBe(hash2);
    });

    test('should generate different hash for different content', async () => {
      const content1 = 'test content 1';
      const content2 = 'test content 2';
      const hash1 = await cacheBuster.generateContentHash(content1);
      const hash2 = await cacheBuster.generateContentHash(content2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Cache Management', () => {
    test('should clear all caches', async () => {
      // Mock caches API
      const mockDelete = jest.fn(() => Promise.resolve(true));
      const mockKeys = jest.fn(() => Promise.resolve(['cache1', 'cache2']));
      
      Object.defineProperty(window, 'caches', {
        value: {
          keys: mockKeys,
          delete: mockDelete
        },
        writable: true
      });

      await cacheBuster.clearAllCaches();
      
      expect(mockKeys).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalledWith('cache1');
      expect(mockDelete).toHaveBeenCalledWith('cache2');
    });
  });

  describe('Test Results', () => {
    test('should get test results', async () => {
      await cacheBuster.testStrategy('timestamp');
      await cacheBuster.testStrategy('random-token');
      
      const results = cacheBuster.getTestResults();
      
      expect(results).toHaveLength(2);
      expect(results[0].strategy).toBe('timestamp');
      expect(results[1].strategy).toBe('random-token');
    });

    test('should get best strategy', async () => {
      await cacheBuster.testStrategy('timestamp');
      await cacheBuster.testStrategy('random-token');
      
      const bestStrategy = cacheBuster.getBestStrategy();
      
      expect(bestStrategy).toBeDefined();
      expect(bestStrategy.success).toBe(true);
    });

    test('should return null for best strategy when no successful tests', async () => {
      // Mock a failing strategy
      const originalTestStrategy = cacheBuster.testStrategy;
      cacheBuster.testStrategy = jest.fn(() => Promise.resolve({
        success: false,
        duration: 100,
        error: 'Test failed'
      }));
      
      await cacheBuster.testStrategy('timestamp');
      
      const bestStrategy = cacheBuster.getBestStrategy();
      
      expect(bestStrategy).toBeNull();
      
      // Restore original method
      cacheBuster.testStrategy = originalTestStrategy;
    });
  });

  describe('Simulate Fetch', () => {
    test('should simulate fetch request', async () => {
      const url = '/api/test';
      const response = await cacheBuster.simulateFetch(url);
      
      expect(response.url).toBe(url);
      expect(response.status).toBe(200);
      expect(response.headers).toBeDefined();
      expect(response.data).toBeDefined();
    });
  });
});