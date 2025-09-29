import { CacheFreshnessExperiment } from '../src/experiments/CacheFreshnessExperiment.js';

describe('CacheFreshnessExperiment', () => {
  let experiment;

  beforeEach(() => {
    experiment = new CacheFreshnessExperiment();
  });

  describe('Cache Timestamp Manipulation Experiment', () => {
    test('should manipulate cache timestamps', async () => {
      const result = await experiment.cacheTimestampManipulation();
      
      expect(result.experiment).toBe('cache-timestamp-manipulation');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.entriesManipulated).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should extract headers from responses', () => {
      const mockResponse = {
        headers: new Map([
          ['etag', '"abc123"'],
          ['last-modified', 'Wed, 21 Oct 2015 07:28:00 GMT'],
          ['cache-control', 'max-age=3600']
        ])
      };
      
      const headers = experiment.extractHeaders(mockResponse);
      
      expect(headers.etag).toBe('"abc123"');
      expect(headers['last-modified']).toBe('Wed, 21 Oct 2015 07:28:00 GMT');
      expect(headers['cache-control']).toBe('max-age=3600');
    });

    test('should handle missing headers gracefully', () => {
      const mockResponse = { headers: null };
      const headers = experiment.extractHeaders(mockResponse);
      
      expect(headers).toEqual({});
    });
  });

  describe('ETag Regeneration Experiment', () => {
    test('should regenerate ETags', async () => {
      const result = await experiment.etagRegeneration();
      
      expect(result.experiment).toBe('etag-regeneration');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.etagsRegenerated).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should generate new ETags with different values', () => {
      const currentETags = [
        { url: '/test1', etag: '"old1"', cacheName: 'cache1' },
        { url: '/test2', etag: '"old2"', cacheName: 'cache2' }
      ];
      
      const newETags = experiment.generateNewETags(currentETags);
      
      expect(newETags).toHaveLength(2);
      expect(newETags[0].newETag).not.toBe(currentETags[0].etag);
      expect(newETags[1].newETag).not.toBe(currentETags[1].etag);
      expect(newETags[0].newETag).toMatch(/^"\d+-[a-z0-9]+"$/);
    });
  });

  describe('Last-Modified Spoofing Experiment', () => {
    test('should spoof Last-Modified dates', async () => {
      const result = await experiment.lastModifiedSpoofing();
      
      expect(result.experiment).toBe('last-modified-spoofing');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.datesSpoofed).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should generate spoofed dates in the past', () => {
      const currentLastModified = [
        { url: '/test1', lastModified: 'Wed, 21 Oct 2015 07:28:00 GMT', cacheName: 'cache1' },
        { url: '/test2', lastModified: 'Wed, 21 Oct 2015 08:28:00 GMT', cacheName: 'cache2' }
      ];
      
      const spoofedDates = experiment.generateSpoofedDates(currentLastModified);
      
      expect(spoofedDates).toHaveLength(2);
      expect(spoofedDates[0].spoofedDate).toBeDefined();
      expect(spoofedDates[1].spoofedDate).toBeDefined();
      
      // Check that spoofed dates are recent (within last few minutes)
      const spoofedTime = new Date(spoofedDates[0].spoofedDate).getTime();
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      
      expect(spoofedTime).toBeGreaterThan(oneMinuteAgo);
      expect(spoofedTime).toBeLessThan(now);
    });
  });

  describe('Cache-Control Override Experiment', () => {
    test('should override Cache-Control headers', async () => {
      const result = await experiment.cacheControlOverride();
      
      expect(result.experiment).toBe('cache-control-override');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.overridesApplied).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should generate cache-busting overrides', () => {
      const currentCacheControl = [
        { url: '/test1', cacheControl: 'max-age=3600', cacheName: 'cache1' },
        { url: '/test2', cacheControl: 'public, max-age=7200', cacheName: 'cache2' }
      ];
      
      const overrides = experiment.generateCacheControlOverrides(currentCacheControl);
      
      expect(overrides).toHaveLength(2);
      expect(overrides[0].override).toContain('no-cache');
      expect(overrides[0].override).toContain('no-store');
      expect(overrides[0].override).toContain('must-revalidate');
      expect(overrides[0].override).toContain('max-age=0');
    });
  });

  describe('Service Worker Cache Invalidation Experiment', () => {
    test('should invalidate service worker caches', async () => {
      const result = await experiment.serviceWorkerCacheInvalidation();
      
      expect(result.experiment).toBe('service-worker-cache-invalidation');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.cachesInvalidated).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should identify critical caches', () => {
      const swCaches = [
        'sw-static-v1',
        'sw-dynamic-v1',
        'main-app-cache',
        'other-cache'
      ];
      
      const criticalCaches = experiment.identifyCriticalCaches(swCaches);
      
      expect(criticalCaches).toContain('sw-static-v1');
      expect(criticalCaches).toContain('main-app-cache');
      expect(criticalCaches).not.toContain('other-cache');
    });
  });

  describe('Prefetch with Fake Headers Experiment', () => {
    test('should prefetch with fake headers', async () => {
      const result = await experiment.prefetchWithFakeHeaders();
      
      expect(result.experiment).toBe('prefetch-with-fake-headers');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.resourcesPrefetched).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should generate fake headers that bypass cache', () => {
      const fakeHeaders = experiment.generateFakeHeaders();
      
      expect(fakeHeaders['User-Agent']).toContain('_fresh_');
      expect(fakeHeaders['Cache-Control']).toBe('no-cache');
      expect(fakeHeaders['Pragma']).toBe('no-cache');
      expect(fakeHeaders['X-Fresh-Request']).toBe('true');
      expect(fakeHeaders['X-Timestamp']).toBeDefined();
    });

    test('should identify prefetch resources', async () => {
      const resources = await experiment.identifyPrefetchResources();
      
      expect(resources).toContain('/index.html');
      expect(resources).toContain('/src/main.js');
      expect(resources).toContain('/sw.js');
      expect(resources).toContain('/manifest.json');
    });
  });

  describe('Conditional Request Bypass Experiment', () => {
    test('should bypass conditional requests', async () => {
      const result = await experiment.conditionalRequestBypass();
      
      expect(result.experiment).toBe('conditional-request-bypass');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.bypassesApplied).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should generate bypass strategies', () => {
      const conditionalRequests = [
        { url: '/api/data', condition: 'If-Modified-Since' },
        { url: '/assets/app.js', condition: 'If-None-Match' }
      ];
      
      const strategies = experiment.generateBypassStrategies(conditionalRequests);
      
      expect(strategies).toHaveLength(2);
      expect(strategies[0].bypassMethod).toBe('remove-conditional-headers');
      expect(strategies[0].newHeaders).toEqual({});
    });
  });

  describe('Cache Vary Header Manipulation Experiment', () => {
    test('should manipulate Vary headers', async () => {
      const result = await experiment.cacheVaryHeaderManipulation();
      
      expect(result.experiment).toBe('cache-vary-header-manipulation');
      expect(result.success).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.headersManipulated).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
    });

    test('should generate manipulated Vary headers', () => {
      const currentVaryHeaders = [
        { url: '/test1', vary: 'Accept-Encoding', cacheName: 'cache1' },
        { url: '/test2', vary: 'User-Agent', cacheName: 'cache2' }
      ];
      
      const manipulated = experiment.generateManipulatedVaryHeaders(currentVaryHeaders);
      
      expect(manipulated).toHaveLength(2);
      expect(manipulated[0].manipulatedVary).toBe('Accept-Encoding, X-Cache-Bust');
      expect(manipulated[1].manipulatedVary).toBe('User-Agent, X-Cache-Bust');
    });
  });

  describe('Comprehensive Testing', () => {
    test('should run all experiments', async () => {
      const results = await experiment.runAllExperiments();
      
      expect(results).toHaveLength(8); // All 8 experiments
      expect(results.every(r => r.experiment)).toBe(true);
      expect(results.every(r => r.timestamp)).toBe(true);
    });

    test('should generate comprehensive analysis', async () => {
      await experiment.runAllExperiments();
      const analysis = experiment.getAnalysis();
      
      expect(analysis.totalExperiments).toBe(8);
      expect(analysis.successful).toBeGreaterThanOrEqual(0);
      expect(analysis.failed).toBeGreaterThanOrEqual(0);
      expect(analysis.successRate).toBeGreaterThanOrEqual(0);
      expect(analysis.successRate).toBeLessThanOrEqual(100);
      expect(analysis.averageDuration).toBeGreaterThan(0);
      expect(analysis.updatePromptEvents).toBeGreaterThanOrEqual(0);
      expect(analysis.recommendations).toHaveLength(6);
    });

    test('should identify most effective experiment', async () => {
      await experiment.runAllExperiments();
      const mostEffective = experiment.getMostEffectiveExperiment();
      
      if (mostEffective) {
        expect(mostEffective.success).toBe(true);
        expect(mostEffective.score).toBeGreaterThan(0);
        expect(mostEffective.experiment).toBeDefined();
      }
    });
  });

  describe('Experiment Scoring', () => {
    test('should calculate experiment scores correctly', () => {
      const mockResult = {
        success: true,
        duration: 500,
        updateDetected: true,
        freshRequestsTriggered: true,
        swUpdateTriggered: true,
        cacheBehaviorChanged: true
      };
      
      const score = experiment.calculateExperimentScore(mockResult);
      
      // 10 for success + 5 for fast execution + 3 for very fast + 3 for updateDetected + 3 for freshRequestsTriggered + 5 for swUpdateTriggered + 2 for cacheBehaviorChanged
      expect(score).toBe(31);
    });

    test('should rank experiments by effectiveness', async () => {
      // Mock some experiment results
      experiment.results.set('experiment1', {
        success: true,
        duration: 300,
        updateDetected: true,
        freshRequestsTriggered: true,
        swUpdateTriggered: true
      });
      
      experiment.results.set('experiment2', {
        success: true,
        duration: 800,
        updateDetected: false,
        freshRequestsTriggered: false,
        swUpdateTriggered: false
      });
      
      const mostEffective = experiment.getMostEffectiveExperiment();
      
      expect(mostEffective.experiment).toBe('experiment1');
      expect(mostEffective.score).toBeGreaterThan(20);
    });
  });

  describe('Data Management', () => {
    test('should record results correctly', () => {
      const mockResult = {
        experiment: 'test-experiment',
        success: true,
        duration: 1000,
        timestamp: Date.now()
      };
      
      experiment.recordResult(mockResult);
      
      expect(experiment.results.has('test-experiment')).toBe(true);
      expect(experiment.performanceMetrics.has('test-experiment')).toBe(true);
    });

    test('should track update prompt events', () => {
      const mockResult = {
        experiment: 'test-experiment',
        success: true,
        duration: 1000,
        timestamp: Date.now()
      };
      
      experiment.recordResult(mockResult);
      
      expect(experiment.updatePromptEvents).toHaveLength(1);
      expect(experiment.updatePromptEvents[0].experiment).toBe('test-experiment');
    });

    test('should clear all data', () => {
      // Add some data
      experiment.results.set('test', { success: true });
      experiment.updatePromptEvents.push({ experiment: 'test' });
      experiment.performanceMetrics.set('test', { duration: 1000 });
      
      // Clear data
      experiment.clearData();
      
      expect(experiment.results.size).toBe(0);
      expect(experiment.updatePromptEvents).toHaveLength(0);
      expect(experiment.performanceMetrics.size).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle experiment failures gracefully', async () => {
      // Mock a failing experiment
      const originalExperiment = experiment.experiments['cache-timestamp-manipulation'];
      experiment.experiments['cache-timestamp-manipulation'] = jest.fn(() => {
        throw new Error('Experiment failed');
      });
      
      const results = await experiment.runAllExperiments();
      const failedResult = results.find(r => r.experiment === 'cache-timestamp-manipulation');
      
      expect(failedResult.success).toBe(false);
      expect(failedResult.error).toBe('Experiment failed');
      
      // Restore original experiment
      experiment.experiments['cache-timestamp-manipulation'] = originalExperiment;
    });
  });

  describe('Recommendations', () => {
    test('should generate appropriate recommendations', async () => {
      await experiment.runAllExperiments();
      const analysis = experiment.getAnalysis();
      
      expect(analysis.recommendations).toContain('Several experiments successfully triggered cache freshness detection');
      expect(analysis.recommendations).toContain('Consider implementing the most effective strategies in production');
      expect(analysis.recommendations).toContain('Monitor user experience when implementing these strategies');
      expect(analysis.recommendations).toContain('Test across different browsers and network conditions');
      expect(analysis.recommendations).toContain('Consider combining multiple strategies for maximum effectiveness');
    });
  });
});