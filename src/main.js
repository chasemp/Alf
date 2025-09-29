// Main application entry point for cache busting research
import { CacheBuster } from './utils/CacheBuster.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';
import { ServiceWorkerManager } from './service-workers/ServiceWorkerManager.js';
import { UpdatePromptTrigger } from './strategies/UpdatePromptTrigger.js';
import { CacheFreshnessExperiment } from './experiments/CacheFreshnessExperiment.js';
import { CacheBustingInvestigation } from './integration/CacheBustingInvestigation.js';

class CacheBustingResearchApp {
  constructor() {
    this.cacheBuster = new CacheBuster();
    this.performanceMonitor = new PerformanceMonitor();
    this.swManager = new ServiceWorkerManager();
    this.updatePromptTrigger = new UpdatePromptTrigger();
    this.cacheFreshnessExperiment = new CacheFreshnessExperiment();
    this.investigation = new CacheBustingInvestigation();
    
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

    // Listen for update prompt events
    this.updatePromptTrigger.onUpdatePrompt((event) => {
      this.handleUpdatePrompt(event);
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

  handleUpdatePrompt(event) {
    console.log('🚨 Update prompt triggered:', event);
    
    // Display update prompt notification
    this.showUpdatePromptNotification(event);
    
    // Update metrics
    this.updateMetrics();
  }

  showUpdatePromptNotification(event) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <h4>🚨 Update Prompt Triggered!</h4>
      <p><strong>Strategy:</strong> ${event.strategy}</p>
      <p><strong>Time:</strong> ${new Date(event.timestamp).toLocaleTimeString()}</p>
      <button onclick="this.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-top: 10px;
      ">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
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

  // Test update prompt trigger strategies
  async testUpdatePromptStrategies() {
    console.log('🚨 Testing update prompt trigger strategies...');
    
    const results = await this.updatePromptTrigger.testAllStrategies();
    console.log('Update prompt trigger results:', results);
    
    // Display results
    this.displayUpdatePromptResults(results);
    
    return results;
  }

  // Test cache freshness experiments
  async testCacheFreshnessExperiments() {
    console.log('🔬 Testing cache freshness experiments...');
    
    const results = await this.cacheFreshnessExperiment.runAllExperiments();
    console.log('Cache freshness experiment results:', results);
    
    // Display results
    this.displayCacheFreshnessResults(results);
    
    return results;
  }

  // Run complete investigation
  async runCompleteInvestigation() {
    console.log('🔍 Running complete cache busting investigation...');
    
    const results = await this.investigation.runCompleteInvestigation();
    console.log('Complete investigation results:', results);
    
    // Display results
    this.displayInvestigationResults(results);
    
    return results;
  }

  // Display update prompt results
  displayUpdatePromptResults(results) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'metrics';
    resultsDiv.innerHTML = `
      <h3>🚨 Update Prompt Trigger Results</h3>
      <div class="metric">
        <span>Total Strategies:</span>
        <span>${results.length}</span>
      </div>
      <div class="metric">
        <span>Successful:</span>
        <span>${results.filter(r => r.success).length}</span>
      </div>
      <div class="metric">
        <span>Most Effective:</span>
        <span>${this.updatePromptTrigger.getMostEffectiveStrategy()?.strategy || 'None'}</span>
      </div>
    `;
    
    document.querySelector('.container').appendChild(resultsDiv);
  }

  // Display cache freshness results
  displayCacheFreshnessResults(results) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'metrics';
    resultsDiv.innerHTML = `
      <h3>🔬 Cache Freshness Experiment Results</h3>
      <div class="metric">
        <span>Total Experiments:</span>
        <span>${results.length}</span>
      </div>
      <div class="metric">
        <span>Successful:</span>
        <span>${results.filter(r => r.success).length}</span>
      </div>
      <div class="metric">
        <span>Update Events:</span>
        <span>${this.cacheFreshnessExperiment.getUpdatePromptEvents().length}</span>
      </div>
    `;
    
    document.querySelector('.container').appendChild(resultsDiv);
  }

  // Display investigation results
  displayInvestigationResults(results) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'metrics';
    resultsDiv.innerHTML = `
      <h3>🔍 Complete Investigation Results</h3>
      <div class="metric">
        <span>Investigation Status:</span>
        <span>${results.success ? '✅ Completed' : '❌ Failed'}</span>
      </div>
      <div class="metric">
        <span>Total Duration:</span>
        <span>${(results.duration / 1000).toFixed(2)}s</span>
      </div>
      <div class="metric">
        <span>Phases Completed:</span>
        <span>${Object.keys(results.phases || {}).length}</span>
      </div>
      <div class="metric">
        <span>Update Prompts Triggered:</span>
        <span>${this.investigation.getUpdatePromptEvents().length}</span>
      </div>
    `;
    
    document.querySelector('.container').appendChild(resultsDiv);
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
window.testUpdatePromptStrategies = () => window.cacheBustingApp.testUpdatePromptStrategies();
window.testCacheFreshnessExperiments = () => window.cacheBustingApp.testCacheFreshnessExperiments();
window.runCompleteInvestigation = () => window.cacheBustingApp.runCompleteInvestigation();