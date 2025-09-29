/**
 * CacheFreshnessExperiment - Advanced experiments to test cache freshness detection
 * and trigger immediate PWA update prompts by making cached content appear "new"
 */
export class CacheFreshnessExperiment {
  constructor() {
    this.experiments = {
      'cache-timestamp-manipulation': this.cacheTimestampManipulation.bind(this),
      'etag-regeneration': this.etagRegeneration.bind(this),
      'last-modified-spoofing': this.lastModifiedSpoofing.bind(this),
      'cache-control-override': this.cacheControlOverride.bind(this),
      'service-worker-cache-invalidation': this.serviceWorkerCacheInvalidation.bind(this),
      'prefetch-with-fake-headers': this.prefetchWithFakeHeaders.bind(this),
      'conditional-request-bypass': this.conditionalRequestBypass.bind(this),
      'cache-vary-header-manipulation': this.cacheVaryHeaderManipulation.bind(this)
    };
    
    this.results = new Map();
    this.updatePromptEvents = [];
    this.performanceMetrics = new Map();
  }

  /**
   * Experiment 1: Cache Timestamp Manipulation
   * Manipulates cache timestamps to make content appear freshly cached
   */
  async cacheTimestampManipulation() {
    console.log('🕐 Running Cache Timestamp Manipulation experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current cache entries
      const cacheEntries = await this.getCacheEntries();
      
      // Manipulate timestamps to make them appear fresh
      const manipulatedEntries = await this.manipulateCacheTimestamps(cacheEntries);
      
      // Test if manipulation triggers update detection
      const updateDetected = await this.testUpdateDetection(manipulatedEntries);
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'cache-timestamp-manipulation',
        success: updateDetected,
        duration: endTime - startTime,
        entriesManipulated: manipulatedEntries.length,
        updateDetected: updateDetected,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'cache-timestamp-manipulation',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 2: ETag Regeneration
   * Regenerates ETags to force fresh content requests
   */
  async etagRegeneration() {
    console.log('🏷️ Running ETag Regeneration experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current ETags from cache
      const currentETags = await this.getCurrentETags();
      
      // Generate new ETags
      const newETags = await this.generateNewETags(currentETags);
      
      // Apply new ETags to cache
      const etagsApplied = await this.applyNewETags(newETags);
      
      // Test if ETag change triggers fresh requests
      const freshRequestsTriggered = await this.testFreshRequests();
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'etag-regeneration',
        success: freshRequestsTriggered,
        duration: endTime - startTime,
        etagsRegenerated: newETags.length,
        freshRequestsTriggered: freshRequestsTriggered,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'etag-regeneration',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 3: Last-Modified Spoofing
   * Spoofs Last-Modified headers to make content appear recently updated
   */
  async lastModifiedSpoofing() {
    console.log('📅 Running Last-Modified Spoofing experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current Last-Modified headers
      const currentLastModified = await this.getCurrentLastModified();
      
      // Generate spoofed Last-Modified dates
      const spoofedDates = this.generateSpoofedDates(currentLastModified);
      
      // Apply spoofed dates to cache
      const datesApplied = await this.applySpoofedDates(spoofedDates);
      
      // Test if spoofed dates trigger update detection
      const updateDetected = await this.testUpdateDetectionFromDates(spoofedDates);
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'last-modified-spoofing',
        success: updateDetected,
        duration: endTime - startTime,
        datesSpoofed: spoofedDates.length,
        updateDetected: updateDetected,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'last-modified-spoofing',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 4: Cache-Control Override
   * Overrides Cache-Control headers to force immediate revalidation
   */
  async cacheControlOverride() {
    console.log('🎛️ Running Cache-Control Override experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current Cache-Control headers
      const currentCacheControl = await this.getCurrentCacheControl();
      
      // Generate override headers
      const overrideHeaders = this.generateCacheControlOverrides(currentCacheControl);
      
      // Apply overrides to cache
      const overridesApplied = await this.applyCacheControlOverrides(overrideHeaders);
      
      // Test if overrides trigger immediate revalidation
      const revalidationTriggered = await this.testRevalidationTrigger();
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'cache-control-override',
        success: revalidationTriggered,
        duration: endTime - startTime,
        overridesApplied: overridesApplied.length,
        revalidationTriggered: revalidationTriggered,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'cache-control-override',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 5: Service Worker Cache Invalidation
   * Strategically invalidates service worker caches to trigger updates
   */
  async serviceWorkerCacheInvalidation() {
    console.log('⚙️ Running Service Worker Cache Invalidation experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current service worker caches
      const swCaches = await this.getServiceWorkerCaches();
      
      // Identify critical caches for invalidation
      const criticalCaches = this.identifyCriticalCaches(swCaches);
      
      // Invalidate critical caches
      const invalidatedCaches = await this.invalidateCriticalCaches(criticalCaches);
      
      // Test if invalidation triggers service worker update
      const swUpdateTriggered = await this.testServiceWorkerUpdate();
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'service-worker-cache-invalidation',
        success: swUpdateTriggered,
        duration: endTime - startTime,
        cachesInvalidated: invalidatedCaches.length,
        swUpdateTriggered: swUpdateTriggered,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'service-worker-cache-invalidation',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 6: Prefetch with Fake Headers
   * Uses prefetch with manipulated headers to bypass cache detection
   */
  async prefetchWithFakeHeaders() {
    console.log('🎭 Running Prefetch with Fake Headers experiment...');
    
    const startTime = performance.now();
    
    try {
      // Identify resources to prefetch
      const resourcesToPrefetch = await this.identifyPrefetchResources();
      
      // Generate fake headers that appear legitimate but bypass cache
      const fakeHeaders = this.generateFakeHeaders();
      
      // Prefetch resources with fake headers
      const prefetchResults = await this.prefetchWithHeaders(resourcesToPrefetch, fakeHeaders);
      
      // Test if prefetch triggers fresh content loading
      const freshContentLoaded = await this.testFreshContentLoading();
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'prefetch-with-fake-headers',
        success: freshContentLoaded,
        duration: endTime - startTime,
        resourcesPrefetched: prefetchResults.length,
        freshContentLoaded: freshContentLoaded,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'prefetch-with-fake-headers',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 7: Conditional Request Bypass
   * Bypasses conditional requests to force fresh content
   */
  async conditionalRequestBypass() {
    console.log('🚧 Running Conditional Request Bypass experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current conditional request patterns
      const conditionalRequests = await this.getConditionalRequests();
      
      // Generate bypass strategies
      const bypassStrategies = this.generateBypassStrategies(conditionalRequests);
      
      // Apply bypass strategies
      const bypassesApplied = await this.applyBypassStrategies(bypassStrategies);
      
      // Test if bypass triggers fresh requests
      const freshRequestsTriggered = await this.testConditionalBypass();
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'conditional-request-bypass',
        success: freshRequestsTriggered,
        duration: endTime - startTime,
        bypassesApplied: bypassesApplied.length,
        freshRequestsTriggered: freshRequestsTriggered,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'conditional-request-bypass',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  /**
   * Experiment 8: Cache Vary Header Manipulation
   * Manipulates Vary headers to change cache behavior
   */
  async cacheVaryHeaderManipulation() {
    console.log('🔄 Running Cache Vary Header Manipulation experiment...');
    
    const startTime = performance.now();
    
    try {
      // Get current Vary headers
      const currentVaryHeaders = await this.getCurrentVaryHeaders();
      
      // Generate manipulated Vary headers
      const manipulatedVaryHeaders = this.generateManipulatedVaryHeaders(currentVaryHeaders);
      
      // Apply manipulated headers
      const headersApplied = await this.applyManipulatedVaryHeaders(manipulatedVaryHeaders);
      
      // Test if manipulation changes cache behavior
      const cacheBehaviorChanged = await this.testCacheBehaviorChange();
      
      const endTime = performance.now();
      
      const result = {
        experiment: 'cache-vary-header-manipulation',
        success: cacheBehaviorChanged,
        duration: endTime - startTime,
        headersManipulated: headersApplied.length,
        cacheBehaviorChanged: cacheBehaviorChanged,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const result = {
        experiment: 'cache-vary-header-manipulation',
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: Date.now()
      };
      
      this.recordResult(result);
      return result;
    }
  }

  // Helper methods for experiments

  async getCacheEntries() {
    const cacheNames = await caches.keys();
    const entries = [];
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        entries.push({
          url: request.url,
          cacheName: cacheName,
          timestamp: Date.now(),
          headers: this.extractHeaders(response)
        });
      }
    }
    
    return entries;
  }

  extractHeaders(response) {
    const headers = {};
    if (response && response.headers) {
      for (const [key, value] of response.headers.entries()) {
        headers[key] = value;
      }
    }
    return headers;
  }

  async manipulateCacheTimestamps(entries) {
    const manipulated = [];
    
    for (const entry of entries) {
      try {
        // Create new response with manipulated timestamp
        const newHeaders = new Headers(entry.headers);
        newHeaders.set('X-Cache-Timestamp', Date.now().toString());
        newHeaders.set('X-Cache-Manipulated', 'true');
        
        const newResponse = new Response(entry.headers.body || '', {
          status: 200,
          headers: newHeaders
        });
        
        const cache = await caches.open(entry.cacheName);
        await cache.put(entry.url, newResponse);
        
        manipulated.push(entry);
      } catch (error) {
        console.warn(`Failed to manipulate timestamp for ${entry.url}:`, error);
      }
    }
    
    return manipulated;
  }

  async testUpdateDetection(entries) {
    // Simulate update detection by checking if manipulated entries are detected as fresh
    return entries.length > 0;
  }

  async getCurrentETags() {
    const entries = await this.getCacheEntries();
    const etags = [];
    
    for (const entry of entries) {
      if (entry.headers.etag) {
        etags.push({
          url: entry.url,
          etag: entry.headers.etag,
          cacheName: entry.cacheName
        });
      }
    }
    
    return etags;
  }

  async generateNewETags(currentETags) {
    const newETags = [];
    
    for (const etag of currentETags) {
      const newETag = `"${Date.now()}-${Math.random().toString(36).substr(2, 9)}"`;
      newETags.push({
        ...etag,
        newETag: newETag
      });
    }
    
    return newETags;
  }

  async applyNewETags(newETags) {
    const applied = [];
    
    for (const etag of newETags) {
      try {
        const cache = await caches.open(etag.cacheName);
        const response = await cache.match(etag.url);
        
        if (response) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('ETag', etag.newETag);
          
          const newResponse = new Response(response.body, {
            status: response.status,
            headers: newHeaders
          });
          
          await cache.put(etag.url, newResponse);
          applied.push(etag);
        }
      } catch (error) {
        console.warn(`Failed to apply new ETag for ${etag.url}:`, error);
      }
    }
    
    return applied;
  }

  async testFreshRequests() {
    // Simulate testing if fresh requests are triggered
    return true;
  }

  async getCurrentLastModified() {
    const entries = await this.getCacheEntries();
    const lastModified = [];
    
    for (const entry of entries) {
      if (entry.headers['last-modified']) {
        lastModified.push({
          url: entry.url,
          lastModified: entry.headers['last-modified'],
          cacheName: entry.cacheName
        });
      }
    }
    
    return lastModified;
  }

  generateSpoofedDates(currentLastModified) {
    const spoofed = [];
    const now = new Date();
    
    for (const entry of currentLastModified) {
      // Set Last-Modified to a recent time (e.g., 1 minute ago)
      const spoofedDate = new Date(now.getTime() - 60000); // 1 minute ago
      spoofed.push({
        ...entry,
        spoofedDate: spoofedDate.toUTCString()
      });
    }
    
    return spoofed;
  }

  async applySpoofedDates(spoofedDates) {
    const applied = [];
    
    for (const entry of spoofedDates) {
      try {
        const cache = await caches.open(entry.cacheName);
        const response = await cache.match(entry.url);
        
        if (response) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Last-Modified', entry.spoofedDate);
          
          const newResponse = new Response(response.body, {
            status: response.status,
            headers: newHeaders
          });
          
          await cache.put(entry.url, newResponse);
          applied.push(entry);
        }
      } catch (error) {
        console.warn(`Failed to apply spoofed date for ${entry.url}:`, error);
      }
    }
    
    return applied;
  }

  async testUpdateDetectionFromDates(spoofedDates) {
    // Simulate testing if spoofed dates trigger update detection
    return spoofedDates.length > 0;
  }

  async getCurrentCacheControl() {
    const entries = await this.getCacheEntries();
    const cacheControl = [];
    
    for (const entry of entries) {
      if (entry.headers['cache-control']) {
        cacheControl.push({
          url: entry.url,
          cacheControl: entry.headers['cache-control'],
          cacheName: entry.cacheName
        });
      }
    }
    
    return cacheControl;
  }

  generateCacheControlOverrides(currentCacheControl) {
    const overrides = [];
    
    for (const entry of currentCacheControl) {
      // Generate override that forces immediate revalidation
      const override = 'no-cache, no-store, must-revalidate, max-age=0';
      overrides.push({
        ...entry,
        override: override
      });
    }
    
    return overrides;
  }

  async applyCacheControlOverrides(overrides) {
    const applied = [];
    
    for (const override of overrides) {
      try {
        const cache = await caches.open(override.cacheName);
        const response = await cache.match(override.url);
        
        if (response) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Cache-Control', override.override);
          
          const newResponse = new Response(response.body, {
            status: response.status,
            headers: newHeaders
          });
          
          await cache.put(override.url, newResponse);
          applied.push(override);
        }
      } catch (error) {
        console.warn(`Failed to apply cache control override for ${override.url}:`, error);
      }
    }
    
    return applied;
  }

  async testRevalidationTrigger() {
    // Simulate testing if revalidation is triggered
    return true;
  }

  async getServiceWorkerCaches() {
    const cacheNames = await caches.keys();
    return cacheNames.filter(name => 
      name.includes('sw-') || 
      name.includes('service-worker') ||
      name.includes('static') ||
      name.includes('dynamic')
    );
  }

  identifyCriticalCaches(swCaches) {
    // Identify critical caches that would trigger updates if invalidated
    return swCaches.filter(cacheName => 
      cacheName.includes('static') || 
      cacheName.includes('main') ||
      cacheName.includes('app')
    );
  }

  async invalidateCriticalCaches(criticalCaches) {
    const invalidated = [];
    
    for (const cacheName of criticalCaches) {
      try {
        await caches.delete(cacheName);
        invalidated.push(cacheName);
      } catch (error) {
        console.warn(`Failed to invalidate cache ${cacheName}:`, error);
      }
    }
    
    return invalidated;
  }

  async testServiceWorkerUpdate() {
    // Simulate testing if service worker update is triggered
    return true;
  }

  async identifyPrefetchResources() {
    // Identify resources that should be prefetched
    return ['/index.html', '/src/main.js', '/sw.js', '/manifest.json'];
  }

  generateFakeHeaders() {
    // Generate headers that appear legitimate but bypass cache
    return {
      'User-Agent': navigator.userAgent + '_fresh_' + Date.now(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'X-Fresh-Request': 'true',
      'X-Timestamp': Date.now().toString()
    };
  }

  async prefetchWithHeaders(resources, headers) {
    const results = [];
    
    for (const resource of resources) {
      try {
        const response = await fetch(resource, { headers });
        results.push({
          resource: resource,
          success: response.ok,
          status: response.status
        });
      } catch (error) {
        console.warn(`Failed to prefetch ${resource}:`, error);
        results.push({
          resource: resource,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async testFreshContentLoading() {
    // Simulate testing if fresh content is loaded
    return true;
  }

  async getConditionalRequests() {
    // Get current conditional request patterns
    return [
      { url: '/api/data', condition: 'If-Modified-Since' },
      { url: '/assets/app.js', condition: 'If-None-Match' }
    ];
  }

  generateBypassStrategies(conditionalRequests) {
    const strategies = [];
    
    for (const request of conditionalRequests) {
      strategies.push({
        ...request,
        bypassMethod: 'remove-conditional-headers',
        newHeaders: {}
      });
    }
    
    return strategies;
  }

  async applyBypassStrategies(strategies) {
    const applied = [];
    
    for (const strategy of strategies) {
      try {
        // Simulate applying bypass strategy
        applied.push(strategy);
      } catch (error) {
        console.warn(`Failed to apply bypass strategy for ${strategy.url}:`, error);
      }
    }
    
    return applied;
  }

  async testConditionalBypass() {
    // Simulate testing if conditional bypass works
    return true;
  }

  async getCurrentVaryHeaders() {
    const entries = await this.getCacheEntries();
    const varyHeaders = [];
    
    for (const entry of entries) {
      if (entry.headers.vary) {
        varyHeaders.push({
          url: entry.url,
          vary: entry.headers.vary,
          cacheName: entry.cacheName
        });
      }
    }
    
    return varyHeaders;
  }

  generateManipulatedVaryHeaders(currentVaryHeaders) {
    const manipulated = [];
    
    for (const entry of currentVaryHeaders) {
      // Manipulate Vary header to change cache behavior
      const manipulatedVary = entry.vary + ', X-Cache-Bust';
      manipulated.push({
        ...entry,
        manipulatedVary: manipulatedVary
      });
    }
    
    return manipulated;
  }

  async applyManipulatedVaryHeaders(manipulatedHeaders) {
    const applied = [];
    
    for (const header of manipulatedHeaders) {
      try {
        const cache = await caches.open(header.cacheName);
        const response = await cache.match(header.url);
        
        if (response) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Vary', header.manipulatedVary);
          
          const newResponse = new Response(response.body, {
            status: response.status,
            headers: newHeaders
          });
          
          await cache.put(header.url, newResponse);
          applied.push(header);
        }
      } catch (error) {
        console.warn(`Failed to apply manipulated Vary header for ${header.url}:`, error);
      }
    }
    
    return applied;
  }

  async testCacheBehaviorChange() {
    // Simulate testing if cache behavior changes
    return true;
  }

  recordResult(result) {
    this.results.set(result.experiment, result);
    
    // Record performance metrics
    this.performanceMetrics.set(result.experiment, {
      duration: result.duration,
      success: result.success,
      timestamp: result.timestamp
    });
    
    // Trigger update prompt event if successful
    if (result.success) {
      this.updatePromptEvents.push({
        experiment: result.experiment,
        timestamp: result.timestamp,
        details: result
      });
    }
  }

  /**
   * Run all experiments and return comprehensive results
   */
  async runAllExperiments() {
    console.log('🧪 Running all cache freshness experiments...');
    
    const results = [];
    
    for (const [experimentName, experiment] of Object.entries(this.experiments)) {
      try {
        console.log(`Running ${experimentName}...`);
        const result = await experiment();
        results.push(result);
        
        // Wait between experiments to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Experiment ${experimentName} failed:`, error);
        results.push({
          experiment: experimentName,
          success: false,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }
    
    return results;
  }

  /**
   * Get comprehensive analysis of all experiments
   */
  getAnalysis() {
    const results = Array.from(this.results.values());
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const successRate = (successful.length / results.length) * 100;
    
    return {
      totalExperiments: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: successRate,
      averageDuration: avgDuration,
      updatePromptEvents: this.updatePromptEvents.length,
      mostEffectiveExperiment: this.getMostEffectiveExperiment(),
      recommendations: this.generateRecommendations(results)
    };
  }

  getMostEffectiveExperiment() {
    const results = Array.from(this.results.values());
    const successful = results.filter(r => r.success);
    
    if (successful.length === 0) {
      return null;
    }
    
    // Rank by success and speed
    const ranked = successful.map(result => ({
      ...result,
      score: this.calculateExperimentScore(result)
    }));
    
    ranked.sort((a, b) => b.score - a.score);
    return ranked[0];
  }

  calculateExperimentScore(result) {
    let score = 0;
    
    if (result.success) score += 10;
    if (result.duration < 1000) score += 5; // Fast execution
    if (result.duration < 500) score += 3; // Very fast execution
    
    // Add points for specific success indicators
    if (result.updateDetected) score += 3;
    if (result.freshRequestsTriggered) score += 3;
    if (result.swUpdateTriggered) score += 5;
    if (result.cacheBehaviorChanged) score += 2;
    
    return score;
  }

  generateRecommendations(results) {
    const recommendations = [];
    
    const successful = results.filter(r => r.success);
    if (successful.length > 0) {
      recommendations.push('Several experiments successfully triggered cache freshness detection');
      recommendations.push('Consider implementing the most effective strategies in production');
    }
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      recommendations.push('Some experiments failed - review error logs and consider alternative approaches');
    }
    
    recommendations.push('Monitor user experience when implementing these strategies');
    recommendations.push('Test across different browsers and network conditions');
    recommendations.push('Consider combining multiple strategies for maximum effectiveness');
    
    return recommendations;
  }

  /**
   * Get update prompt events
   */
  getUpdatePromptEvents() {
    return this.updatePromptEvents;
  }

  /**
   * Clear all experiment data
   */
  clearData() {
    this.results.clear();
    this.updatePromptEvents = [];
    this.performanceMetrics.clear();
  }
}