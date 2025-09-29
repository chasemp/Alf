/**
 * CacheBuster - Utility class for testing different cache busting strategies
 */
export class CacheBuster {
  constructor() {
    this.strategies = {
      timestamp: this.timestampStrategy.bind(this),
      'random-token': this.randomTokenStrategy.bind(this),
      'content-hash': this.contentHashStrategy.bind(this),
      'version-based': this.versionBasedStrategy.bind(this)
    };
    
    this.testResults = new Map();
  }

  /**
   * Test a specific cache busting strategy
   * @param {string} strategyName - Name of the strategy to test
   */
  async testStrategy(strategyName) {
    console.log(`🧪 Testing ${strategyName} strategy...`);
    
    const strategy = this.strategies[strategyName];
    if (!strategy) {
      throw new Error(`Unknown strategy: ${strategyName}`);
    }

    const startTime = performance.now();
    
    try {
      const result = await strategy();
      const endTime = performance.now();
      
      const testResult = {
        strategy: strategyName,
        success: true,
        duration: endTime - startTime,
        result: result,
        timestamp: new Date().toISOString()
      };
      
      this.testResults.set(strategyName, testResult);
      console.log(`✅ ${strategyName} test completed in ${testResult.duration.toFixed(2)}ms`);
      
      return testResult;
    } catch (error) {
      const endTime = performance.now();
      
      const testResult = {
        strategy: strategyName,
        success: false,
        duration: endTime - startTime,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      this.testResults.set(strategyName, testResult);
      console.error(`❌ ${strategyName} test failed:`, error);
      
      return testResult;
    }
  }

  /**
   * Timestamp-based cache busting strategy
   */
  async timestampStrategy() {
    const timestamp = Date.now();
    const testUrl = `/api/test-data?t=${timestamp}`;
    
    // Simulate fetching with timestamp
    const response = await this.simulateFetch(testUrl);
    
    return {
      method: 'timestamp',
      url: testUrl,
      cacheBustValue: timestamp,
      response: response
    };
  }

  /**
   * Random token-based cache busting strategy
   */
  async randomTokenStrategy() {
    const token = this.generateRandomToken();
    const testUrl = `/api/test-data?cb=${token}`;
    
    // Simulate fetching with random token
    const response = await this.simulateFetch(testUrl);
    
    return {
      method: 'random-token',
      url: testUrl,
      cacheBustValue: token,
      response: response
    };
  }

  /**
   * Content hash-based cache busting strategy
   */
  async contentHashStrategy() {
    const content = 'test-content-' + Date.now();
    const hash = await this.generateContentHash(content);
    const testUrl = `/api/test-data?h=${hash}`;
    
    // Simulate fetching with content hash
    const response = await this.simulateFetch(testUrl);
    
    return {
      method: 'content-hash',
      url: testUrl,
      cacheBustValue: hash,
      content: content,
      response: response
    };
  }

  /**
   * Version-based cache busting strategy
   */
  async versionBasedStrategy() {
    const version = '1.0.0';
    const buildNumber = Math.floor(Date.now() / 1000);
    const testUrl = `/api/test-data?v=${version}&b=${buildNumber}`;
    
    // Simulate fetching with version
    const response = await this.simulateFetch(testUrl);
    
    return {
      method: 'version-based',
      url: testUrl,
      version: version,
      buildNumber: buildNumber,
      response: response
    };
  }

  /**
   * Generate a random token for cache busting
   */
  generateRandomToken() {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate a content hash using Web Crypto API
   */
  async generateContentHash(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simulate a fetch request for testing
   */
  async simulateFetch(url) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    
    // Simulate response
    return {
      url: url,
      status: 200,
      headers: {
        'cache-control': 'max-age=3600',
        'etag': `"${Date.now()}"`
      },
      data: {
        message: 'Test data',
        timestamp: Date.now(),
        url: url
      }
    };
  }

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    console.log('🗑️ Clearing all caches...');
    
    // Clear browser cache (if possible)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
    
    console.log('✅ All caches cleared');
  }

  /**
   * Get test results for all strategies
   */
  getTestResults() {
    return Array.from(this.testResults.values());
  }

  /**
   * Get the best performing strategy
   */
  getBestStrategy() {
    const results = this.getTestResults();
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      return null;
    }
    
    // Sort by duration (lower is better)
    successfulResults.sort((a, b) => a.duration - b.duration);
    
    return successfulResults[0];
  }
}