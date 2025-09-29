import { UpdatePromptTrigger } from '../src/strategies/UpdatePromptTrigger.js';

describe('UpdatePromptTrigger', () => {
  let updatePromptTrigger;

  beforeEach(() => {
    updatePromptTrigger = new UpdatePromptTrigger();
  });

  describe('Service Worker Version Bump Strategy', () => {
    test('should increment service worker version', async () => {
      const result = await updatePromptTrigger.serviceWorkerVersionBump();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('service-worker-version-bump');
      expect(result.oldVersion).toBeDefined();
      expect(result.newVersion).toBeDefined();
      expect(result.newVersion).not.toBe(result.oldVersion);
    });

    test('should trigger update prompt callback', async () => {
      const callback = jest.fn();
      updatePromptTrigger.onUpdatePrompt(callback);
      
      await updatePromptTrigger.serviceWorkerVersionBump();
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          strategy: 'service-worker-version-bump',
          details: expect.any(Object),
          timestamp: expect.any(Number)
        })
      );
    });
  });

  describe('Cache Signature Invalidation Strategy', () => {
    test('should modify cache signatures', async () => {
      const result = await updatePromptTrigger.cacheSignatureInvalidation();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('cache-signature-invalidation');
      expect(result.signaturesModified).toBeGreaterThan(0);
    });

    test('should generate different signatures for same content', () => {
      const signatures1 = updatePromptTrigger.generateCacheSignatures();
      const signatures2 = updatePromptTrigger.generateCacheSignatures();
      
      // Wait a bit to ensure different timestamps
      setTimeout(() => {
        const modified1 = updatePromptTrigger.modifySignatures(signatures1);
        const modified2 = updatePromptTrigger.modifySignatures(signatures2);
        
        expect(modified1).not.toEqual(modified2);
      }, 10);
    });
  });

  describe('Manifest Fingerprint Update Strategy', () => {
    test('should update manifest fingerprint', async () => {
      const result = await updatePromptTrigger.manifestFingerprintUpdate();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('manifest-fingerprint-update');
      expect(result.manifestUpdated).toBe(true);
    });

    test('should increment manifest version', async () => {
      const manifest = await updatePromptTrigger.getCurrentManifest();
      const updatedManifest = updatePromptTrigger.updateManifestFingerprint(manifest);
      
      expect(updatedManifest.version).not.toBe(manifest.version);
      expect(updatedManifest.fingerprint).not.toBe(manifest.fingerprint);
    });
  });

  describe('Prefetch with Fresh Headers Strategy', () => {
    test('should prefetch resources with fresh headers', async () => {
      const result = await updatePromptTrigger.prefetchWithFreshHeaders();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('prefetch-with-fresh-headers');
      expect(result.resourcesPrefetched).toBeGreaterThan(0);
    });

    test('should generate cache-busting headers', () => {
      const headers = updatePromptTrigger.generateFreshHeaders();
      
      expect(headers['Cache-Control']).toContain('no-cache');
      expect(headers['X-Cache-Bust']).toBeDefined();
      expect(headers['Pragma']).toBe('no-cache');
    });
  });

  describe('Selective Cache Poisoning Strategy', () => {
    test('should poison selected cache targets', async () => {
      const result = await updatePromptTrigger.selectiveCachePoisoning();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('selective-cache-poisoning');
      expect(result.targetsPoisoned).toBeGreaterThan(0);
    });

    test('should select appropriate poison targets', async () => {
      const entries = await updatePromptTrigger.analyzeCacheEntries();
      const targets = updatePromptTrigger.selectPoisonTargets(entries);
      
      // Should select critical resources
      const hasCriticalResources = targets.some(target => 
        target.url.includes('.js') || 
        target.url.includes('.css') ||
        target.url.includes('index.html')
      );
      
      expect(hasCriticalResources).toBe(true);
    });
  });

  describe('Network Condition Simulation Strategy', () => {
    test('should simulate different network conditions', async () => {
      const result = await updatePromptTrigger.networkConditionSimulation();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('network-condition-simulation');
      expect(result.conditionsSimulated).toBeGreaterThan(0);
    });

    test('should generate various network conditions', () => {
      const conditions = updatePromptTrigger.generateNetworkConditions();
      
      expect(conditions).toHaveLength(4);
      expect(conditions.map(c => c.type)).toContain('slow-2g');
      expect(conditions.map(c => c.type)).toContain('fast-3g');
      expect(conditions.map(c => c.type)).toContain('4g');
      expect(conditions.map(c => c.type)).toContain('offline');
    });
  });

  describe('User Agent Fingerprint Busting Strategy', () => {
    test('should change user agent fingerprint', async () => {
      const result = await updatePromptTrigger.userAgentFingerprintBusting();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('user-agent-fingerprint-busting');
      expect(result.fingerprintChanged).toBe(true);
    });

    test('should generate new fingerprint', async () => {
      const current = await updatePromptTrigger.getCurrentFingerprint();
      const newFingerprint = updatePromptTrigger.generateNewFingerprint(current);
      
      expect(newFingerprint.userAgent).not.toBe(current.userAgent);
      expect(newFingerprint.fingerprint).toBeDefined();
    });
  });

  describe('Time-based Cache Expiry Strategy', () => {
    test('should manipulate cache expiry times', async () => {
      const result = await updatePromptTrigger.timeBasedCacheExpiry();
      
      expect(result.success).toBe(true);
      expect(result.strategy).toBe('time-based-cache-expiry');
      expect(result.entriesExpired).toBeGreaterThan(0);
    });

    test('should calculate expiry manipulation', async () => {
      const entries = await updatePromptTrigger.analyzeCacheEntries();
      const manipulation = updatePromptTrigger.calculateExpiryManipulation(entries);
      
      expect(manipulation).toHaveLength(entries.length);
      manipulation.forEach(entry => {
        expect(entry.newExpiry).toBeLessThan(Date.now());
        expect(entry.manipulationType).toBe('force-expiry');
      });
    });
  });

  describe('Comprehensive Testing', () => {
    test('should test all strategies', async () => {
      const results = await updatePromptTrigger.testAllStrategies();
      
      expect(results).toHaveLength(8); // All 8 strategies
      expect(results.every(r => r.strategy)).toBe(true);
    });

    test('should identify most effective strategy', async () => {
      await updatePromptTrigger.testAllStrategies();
      const mostEffective = updatePromptTrigger.getMostEffectiveStrategy();
      
      expect(mostEffective).toBeDefined();
      expect(mostEffective.success).toBe(true);
      expect(mostEffective.score).toBeGreaterThan(0);
    });

    test('should generate comprehensive test report', async () => {
      await updatePromptTrigger.testAllStrategies();
      const report = updatePromptTrigger.generateTestReport();
      
      expect(report.totalStrategies).toBe(8);
      expect(report.successful).toBeGreaterThan(0);
      expect(report.successRate).toBeGreaterThan(0);
      expect(report.mostEffective).toBeDefined();
      expect(report.recommendations).toHaveLength(4);
    });
  });

  describe('Strategy Scoring', () => {
    test('should calculate strategy scores correctly', () => {
      const mockResult = {
        success: true,
        details: {
          updateTriggered: true,
          cacheInvalidated: true,
          freshRequestsTriggered: true
        }
      };
      
      const score = updatePromptTrigger.calculateStrategyScore(mockResult);
      
      // 10 for success + 5 for updateTriggered + 3 for cacheInvalidated + 2 for freshRequestsTriggered
      expect(score).toBe(20);
    });

    test('should rank strategies by effectiveness', async () => {
      // Mock some test results
      updatePromptTrigger.testResults.set('strategy1', {
        success: true,
        details: { updateTriggered: true, cacheInvalidated: true, freshRequestsTriggered: true }
      });
      
      updatePromptTrigger.testResults.set('strategy2', {
        success: true,
        details: { updateTriggered: true, cacheInvalidated: false, freshRequestsTriggered: false }
      });
      
      const mostEffective = updatePromptTrigger.getMostEffectiveStrategy();
      
      expect(mostEffective.strategy).toBe('strategy1');
      expect(mostEffective.score).toBeGreaterThan(15); // Higher score
    });
  });

  describe('Error Handling', () => {
    test('should handle strategy failures gracefully', async () => {
      // Mock a failing strategy
      const originalStrategy = updatePromptTrigger.strategies['service-worker-version-bump'];
      updatePromptTrigger.strategies['service-worker-version-bump'] = jest.fn(() => {
        throw new Error('Strategy failed');
      });
      
      const results = await updatePromptTrigger.testAllStrategies();
      const failedResult = results.find(r => r.strategy === 'service-worker-version-bump');
      
      expect(failedResult.success).toBe(false);
      expect(failedResult.error).toBe('Strategy failed');
      
      // Restore original strategy
      updatePromptTrigger.strategies['service-worker-version-bump'] = originalStrategy;
    });
  });

  describe('Update Prompt Callbacks', () => {
    test('should register multiple callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      updatePromptTrigger.onUpdatePrompt(callback1);
      updatePromptTrigger.onUpdatePrompt(callback2);
      
      expect(updatePromptTrigger.updatePromptCallbacks).toHaveLength(2);
    });

    test('should trigger all registered callbacks', async () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      updatePromptTrigger.onUpdatePrompt(callback1);
      updatePromptTrigger.onUpdatePrompt(callback2);
      
      await updatePromptTrigger.serviceWorkerVersionBump();
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
});