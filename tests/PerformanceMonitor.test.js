import { PerformanceMonitor } from '../src/utils/PerformanceMonitor.js';

describe('PerformanceMonitor', () => {
  let performanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
  });

  describe('Initialization', () => {
    test('should initialize with default metrics', () => {
      expect(performanceMonitor.metrics).toBeDefined();
      expect(performanceMonitor.metrics.cacheHitRatio).toBe(0);
      expect(performanceMonitor.metrics.loadTime).toBe(0);
      expect(performanceMonitor.metrics.bandwidthUsage).toBe(0);
    });

    test('should not be monitoring initially', () => {
      expect(performanceMonitor.isMonitoring).toBe(false);
    });
  });

  describe('Monitoring Control', () => {
    test('should start monitoring', () => {
      performanceMonitor.start();
      
      expect(performanceMonitor.isMonitoring).toBe(true);
      expect(performanceMonitor.startTime).toBeDefined();
    });

    test('should stop monitoring', () => {
      performanceMonitor.start();
      performanceMonitor.stop();
      
      expect(performanceMonitor.isMonitoring).toBe(false);
    });

    test('should not start monitoring if already monitoring', () => {
      performanceMonitor.start();
      const startTime = performanceMonitor.startTime;
      
      performanceMonitor.start(); // Should not restart
      
      expect(performanceMonitor.startTime).toBe(startTime);
    });
  });

  describe('Navigation Timing', () => {
    test('should monitor navigation timing', () => {
      // Mock performance.getEntriesByType
      const mockNavigation = {
        loadEventEnd: 1000,
        loadEventStart: 500
      };
      
      jest.spyOn(performance, 'getEntriesByType').mockReturnValue([mockNavigation]);
      
      performanceMonitor.monitorNavigationTiming();
      
      expect(performanceMonitor.metrics.loadTime).toBe(500);
    });

    test('should handle missing performance API', () => {
      const originalPerformance = window.performance;
      delete window.performance;
      
      expect(() => performanceMonitor.monitorNavigationTiming()).not.toThrow();
      
      window.performance = originalPerformance;
    });
  });

  describe('Resource Timing', () => {
    test('should monitor resource timing', () => {
      const mockResources = [
        { transferSize: 1024, decodedBodySize: 2048 },
        { transferSize: 0, decodedBodySize: 1024 }, // Cached resource
        { transferSize: 512, decodedBodySize: 1024 }
      ];
      
      jest.spyOn(performance, 'getEntriesByType').mockReturnValue(mockResources);
      
      performanceMonitor.monitorResourceTiming();
      
      expect(performanceMonitor.metrics.bandwidthUsage).toBe(1536); // 1024 + 0 + 512
      expect(performanceMonitor.metrics.cacheHits).toBe(1);
      expect(performanceMonitor.metrics.cacheMisses).toBe(2);
      expect(performanceMonitor.metrics.requests).toBe(3);
      expect(performanceMonitor.metrics.cacheHitRatio).toBeCloseTo(0.333, 3);
    });

    test('should handle zero cache hits and misses', () => {
      jest.spyOn(performance, 'getEntriesByType').mockReturnValue([]);
      
      performanceMonitor.monitorResourceTiming();
      
      expect(performanceMonitor.metrics.cacheHitRatio).toBe(0);
    });
  });

  describe('Benchmarks', () => {
    test('should run cache busting strategy benchmarks', async () => {
      const results = await performanceMonitor.benchmarkCacheBustingStrategies();
      
      expect(results).toBeDefined();
      expect(results.timestamp).toBeDefined();
      expect(results['random-token']).toBeDefined();
      expect(results['content-hash']).toBeDefined();
      expect(results['version-based']).toBeDefined();
      
      expect(results.timestamp.duration).toBeDefined();
      expect(results.timestamp.efficiency).toBeDefined();
    });

    test('should run service worker performance benchmarks', async () => {
      const results = await performanceMonitor.benchmarkServiceWorkerPerformance();
      
      expect(results).toBeDefined();
      expect(results.registrationTime).toBeDefined();
      expect(results.cacheOperations).toBeDefined();
      expect(results.networkRequests).toBeDefined();
    });

    test('should run network condition benchmarks', async () => {
      const results = await performanceMonitor.benchmarkNetworkConditions();
      
      expect(results).toBeDefined();
      expect(results['fast-3g']).toBeDefined();
      expect(results['slow-3g']).toBeDefined();
      expect(results.offline).toBeDefined();
      expect(results.online).toBeDefined();
      
      expect(results['fast-3g'].responseTime).toBeDefined();
      expect(results['fast-3g'].reliability).toBeDefined();
    });
  });

  describe('Analysis', () => {
    test('should analyze cache efficiency', () => {
      performanceMonitor.metrics.cacheHitRatio = 0.9;
      expect(performanceMonitor.analyzeCacheEfficiency()).toBe('Excellent');
      
      performanceMonitor.metrics.cacheHitRatio = 0.7;
      expect(performanceMonitor.analyzeCacheEfficiency()).toBe('Good');
      
      performanceMonitor.metrics.cacheHitRatio = 0.5;
      expect(performanceMonitor.analyzeCacheEfficiency()).toBe('Fair');
      
      performanceMonitor.metrics.cacheHitRatio = 0.3;
      expect(performanceMonitor.analyzeCacheEfficiency()).toBe('Poor');
    });

    test('should generate recommendations', () => {
      performanceMonitor.metrics.cacheHitRatio = 0.3;
      performanceMonitor.metrics.loadTime = 1500;
      
      const recommendation = performanceMonitor.generateRecommendation();
      expect(recommendation).toContain('aggressive caching');
      
      performanceMonitor.metrics.cacheHitRatio = 0.6;
      performanceMonitor.metrics.loadTime = 500;
      
      const recommendation2 = performanceMonitor.generateRecommendation();
      expect(recommendation2).toContain('cache invalidation');
    });

    test('should calculate optimization score', () => {
      performanceMonitor.metrics.cacheHitRatio = 0.8;
      performanceMonitor.metrics.loadTime = 1000;
      
      const score = performanceMonitor.calculateOptimizationScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(10);
    });

    test('should identify bottlenecks', () => {
      performanceMonitor.metrics.cacheHitRatio = 0.3;
      performanceMonitor.metrics.loadTime = 2500;
      performanceMonitor.metrics.bandwidthUsage = 2 * 1024 * 1024;
      
      const bottlenecks = performanceMonitor.identifyBottlenecks();
      
      expect(bottlenecks).toContain('Low cache hit ratio');
      expect(bottlenecks).toContain('Slow load time');
      expect(bottlenecks).toContain('High bandwidth usage');
    });
  });

  describe('Event Listeners', () => {
    test('should add metrics update listener', () => {
      const callback = jest.fn();
      performanceMonitor.onMetricsUpdate(callback);
      
      expect(performanceMonitor.listeners.get('metricsUpdate')).toBe(callback);
    });

    test('should notify listeners', () => {
      const callback = jest.fn();
      performanceMonitor.onMetricsUpdate(callback);
      
      performanceMonitor.notifyListeners('metricsUpdate', { test: 'data' });
      
      expect(callback).toHaveBeenCalledWith({ test: 'data' });
    });
  });

  describe('Current Metrics', () => {
    test('should get current metrics', () => {
      performanceMonitor.metrics.cacheHitRatio = 0.75;
      performanceMonitor.metrics.loadTime = 1200;
      
      const currentMetrics = performanceMonitor.getCurrentMetrics();
      
      expect(currentMetrics.cacheHitRatio).toBe(0.75);
      expect(currentMetrics.loadTime).toBe(1200);
      expect(currentMetrics).not.toBe(performanceMonitor.metrics); // Should be a copy
    });
  });
});