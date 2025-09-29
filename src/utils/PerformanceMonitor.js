/**
 * PerformanceMonitor - Utility class for monitoring and analyzing performance metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      cacheHitRatio: 0,
      loadTime: 0,
      bandwidthUsage: 0,
      requests: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.listeners = new Map();
    this.isMonitoring = false;
    this.startTime = null;
  }

  /**
   * Start performance monitoring
   */
  start() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.startTime = performance.now();
    
    // Monitor navigation timing
    this.monitorNavigationTiming();
    
    // Monitor resource timing
    this.monitorResourceTiming();
    
    // Monitor service worker performance
    this.monitorServiceWorkerPerformance();
    
    console.log('📊 Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stop() {
    this.isMonitoring = false;
    console.log('📊 Performance monitoring stopped');
  }

  /**
   * Monitor navigation timing
   */
  monitorNavigationTiming() {
    if (!('performance' in window)) {
      return;
    }

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.notifyListeners('metricsUpdate', this.metrics);
    }
  }

  /**
   * Monitor resource timing
   */
  monitorResourceTiming() {
    if (!('performance' in window)) {
      return;
    }

    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    let cacheHits = 0;
    let cacheMisses = 0;

    resources.forEach(resource => {
      totalSize += resource.transferSize || 0;
      
      // Determine if resource was cached
      if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
        cacheHits++;
      } else {
        cacheMisses++;
      }
    });

    this.metrics.bandwidthUsage = totalSize;
    this.metrics.cacheHits = cacheHits;
    this.metrics.cacheMisses = cacheMisses;
    this.metrics.requests = resources.length;
    this.metrics.cacheHitRatio = cacheHits / (cacheHits + cacheMisses) || 0;

    this.notifyListeners('metricsUpdate', this.metrics);
  }

  /**
   * Monitor service worker performance
   */
  monitorServiceWorkerPerformance() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'PERFORMANCE_METRICS') {
        this.updateMetricsFromSW(event.data.metrics);
      }
    });
  }

  /**
   * Update metrics from service worker
   */
  updateMetricsFromSW(swMetrics) {
    this.metrics = { ...this.metrics, ...swMetrics };
    this.notifyListeners('metricsUpdate', this.metrics);
  }

  /**
   * Run performance benchmarks
   */
  async runBenchmarks() {
    console.log('🏃 Running performance benchmarks...');
    
    const benchmarks = {
      cacheBustingStrategies: await this.benchmarkCacheBustingStrategies(),
      serviceWorkerPerformance: await this.benchmarkServiceWorkerPerformance(),
      networkConditions: await this.benchmarkNetworkConditions()
    };

    const overallScore = this.calculateOverallScore(benchmarks);
    
    return {
      ...benchmarks,
      overallScore,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Benchmark different cache busting strategies
   */
  async benchmarkCacheBustingStrategies() {
    const strategies = ['timestamp', 'random-token', 'content-hash', 'version-based'];
    const results = {};

    for (const strategy of strategies) {
      const startTime = performance.now();
      
      // Simulate strategy execution
      await this.simulateStrategyExecution(strategy);
      
      const endTime = performance.now();
      results[strategy] = {
        duration: endTime - startTime,
        efficiency: Math.random() * 100 // Simulated efficiency score
      };
    }

    return results;
  }

  /**
   * Benchmark service worker performance
   */
  async benchmarkServiceWorkerPerformance() {
    const startTime = performance.now();
    
    // Simulate service worker operations
    await this.simulateServiceWorkerOperations();
    
    const endTime = performance.now();
    
    return {
      registrationTime: endTime - startTime,
      cacheOperations: Math.random() * 100,
      networkRequests: Math.random() * 50
    };
  }

  /**
   * Benchmark different network conditions
   */
  async benchmarkNetworkConditions() {
    const conditions = ['fast-3g', 'slow-3g', 'offline', 'online'];
    const results = {};

    for (const condition of conditions) {
      const startTime = performance.now();
      
      // Simulate network condition
      await this.simulateNetworkCondition(condition);
      
      const endTime = performance.now();
      results[condition] = {
        responseTime: endTime - startTime,
        reliability: Math.random() * 100
      };
    }

    return results;
  }

  /**
   * Analyze current performance
   */
  async analyze() {
    const analysis = {
      cacheEfficiency: this.analyzeCacheEfficiency(),
      recommendation: this.generateRecommendation(),
      optimizationScore: this.calculateOptimizationScore(),
      bottlenecks: this.identifyBottlenecks()
    };

    return analysis;
  }

  /**
   * Analyze cache efficiency
   */
  analyzeCacheEfficiency() {
    const hitRatio = this.metrics.cacheHitRatio;
    
    if (hitRatio > 0.8) {
      return 'Excellent';
    } else if (hitRatio > 0.6) {
      return 'Good';
    } else if (hitRatio > 0.4) {
      return 'Fair';
    } else {
      return 'Poor';
    }
  }

  /**
   * Generate performance recommendation
   */
  generateRecommendation() {
    const hitRatio = this.metrics.cacheHitRatio;
    const loadTime = this.metrics.loadTime;
    
    if (hitRatio < 0.5 && loadTime > 1000) {
      return 'Implement aggressive caching strategy';
    } else if (hitRatio < 0.7) {
      return 'Optimize cache invalidation';
    } else if (loadTime > 2000) {
      return 'Focus on load time optimization';
    } else {
      return 'Performance is optimal';
    }
  }

  /**
   * Calculate optimization score
   */
  calculateOptimizationScore() {
    const hitRatio = this.metrics.cacheHitRatio;
    const loadTime = this.metrics.loadTime;
    
    // Score based on cache hit ratio (0-5 points)
    const cacheScore = hitRatio * 5;
    
    // Score based on load time (0-5 points)
    const loadScore = Math.max(0, 5 - (loadTime / 1000));
    
    return Math.round((cacheScore + loadScore) / 2);
  }

  /**
   * Identify performance bottlenecks
   */
  identifyBottlenecks() {
    const bottlenecks = [];
    
    if (this.metrics.cacheHitRatio < 0.5) {
      bottlenecks.push('Low cache hit ratio');
    }
    
    if (this.metrics.loadTime > 2000) {
      bottlenecks.push('Slow load time');
    }
    
    if (this.metrics.bandwidthUsage > 1024 * 1024) {
      bottlenecks.push('High bandwidth usage');
    }
    
    return bottlenecks;
  }

  /**
   * Calculate overall performance score
   */
  calculateOverallScore(benchmarks) {
    const scores = Object.values(benchmarks).map(benchmark => {
      if (typeof benchmark === 'object' && benchmark.efficiency) {
        return benchmark.efficiency;
      }
      return 50; // Default score
    });
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Simulate strategy execution
   */
  async simulateStrategyExecution(strategy) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  }

  /**
   * Simulate service worker operations
   */
  async simulateServiceWorkerOperations() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  }

  /**
   * Simulate network condition
   */
  async simulateNetworkCondition(condition) {
    const delays = {
      'fast-3g': 100,
      'slow-3g': 500,
      'offline': 0,
      'online': 50
    };
    
    await new Promise(resolve => setTimeout(resolve, delays[condition] || 100));
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics() {
    return { ...this.metrics };
  }

  /**
   * Add event listener
   */
  onMetricsUpdate(callback) {
    this.listeners.set('metricsUpdate', callback);
  }

  /**
   * Notify listeners
   */
  notifyListeners(event, data) {
    const callback = this.listeners.get(event);
    if (callback) {
      callback(data);
    }
  }
}