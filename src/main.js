// Main application entry point for cache busting research
import { CacheBuster } from './utils/CacheBuster.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';
import { ServiceWorkerManager } from './service-workers/ServiceWorkerManager.js';

class CacheBustingResearchApp {
  constructor() {
    this.cacheBuster = new CacheBuster();
    this.performanceMonitor = new PerformanceMonitor();
    this.swManager = new ServiceWorkerManager();
    
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Cache Busting Research App');
    
    // Initialize service worker
    await this.swManager.register();
    
    // Start performance monitoring
    this.performanceMonitor.start();
    
    // Update UI with initial metrics
    this.updateMetrics();
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('✅ App initialized successfully');
  }

  setupEventListeners() {
    // Listen for service worker updates
    this.swManager.onUpdate(() => {
      this.updateServiceWorkerStatus();
    });

    // Listen for performance metrics updates
    this.performanceMonitor.onMetricsUpdate((metrics) => {
      this.updateMetrics(metrics);
    });
  }

  updateMetrics(metrics = null) {
    const currentMetrics = metrics || this.performanceMonitor.getCurrentMetrics();
    
    document.getElementById('cache-hit-ratio').textContent = 
      `${(currentMetrics.cacheHitRatio * 100).toFixed(1)}%`;
    
    document.getElementById('load-time').textContent = 
      `${currentMetrics.loadTime.toFixed(2)}ms`;
    
    document.getElementById('bandwidth').textContent = 
      `${(currentMetrics.bandwidthUsage / 1024).toFixed(2)}KB`;
    
    document.getElementById('sw-status').textContent = 
      this.swManager.getStatus();
  }

  updateServiceWorkerStatus() {
    document.getElementById('sw-status').textContent = this.swManager.getStatus();
  }

  // Test different cache busting strategies
  async testCacheBusting() {
    console.log('🧪 Testing cache busting strategies...');
    
    const strategies = [
      'timestamp',
      'random-token',
      'content-hash',
      'version-based'
    ];

    for (const strategy of strategies) {
      console.log(`Testing ${strategy} strategy...`);
      await this.cacheBuster.testStrategy(strategy);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between tests
    }
    
    console.log('✅ Cache busting tests completed');
    this.updateMetrics();
  }

  // Run performance benchmarks
  async runBenchmarks() {
    console.log('📊 Running performance benchmarks...');
    
    const results = await this.performanceMonitor.runBenchmarks();
    console.log('Benchmark results:', results);
    
    // Update UI with benchmark results
    this.updateMetrics(results);
  }

  // Analyze current performance
  async analyzePerformance() {
    console.log('🔍 Analyzing performance...');
    
    const analysis = await this.performanceMonitor.analyze();
    console.log('Performance analysis:', analysis);
    
    // Display analysis results
    this.displayAnalysisResults(analysis);
  }

  displayAnalysisResults(analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.className = 'metrics';
    analysisDiv.innerHTML = `
      <h3>Performance Analysis Results</h3>
      <div class="metric">
        <span>Cache Efficiency:</span>
        <span>${analysis.cacheEfficiency}</span>
      </div>
      <div class="metric">
        <span>Recommendation:</span>
        <span>${analysis.recommendation}</span>
      </div>
      <div class="metric">
        <span>Optimization Score:</span>
        <span>${analysis.optimizationScore}/10</span>
      </div>
    `;
    
    document.querySelector('.container').appendChild(analysisDiv);
  }

  // Clear all caches
  async clearAllCaches() {
    console.log('🗑️ Clearing all caches...');
    
    await this.cacheBuster.clearAllCaches();
    await this.swManager.clearCaches();
    
    console.log('✅ All caches cleared');
    this.updateMetrics();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cacheBustingApp = new CacheBustingResearchApp();
});

// Make functions globally available for button clicks
window.testCacheBusting = () => window.cacheBustingApp.testCacheBusting();
window.runBenchmarks = () => window.cacheBustingApp.runBenchmarks();
window.analyzePerformance = () => window.cacheBustingApp.analyzePerformance();
window.clearAllCaches = () => window.cacheBustingApp.clearAllCaches();