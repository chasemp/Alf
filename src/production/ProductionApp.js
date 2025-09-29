/**
 * Production App - Integrates all effective cache busting strategies
 * Based on investigation results and production requirements
 */
import { CacheBustingManager } from './CacheBustingManager.js';
import { PerformanceMonitor } from '../utils/PerformanceMonitor.js';

export class ProductionApp {
  constructor() {
    this.cacheBustingManager = new CacheBustingManager();
    this.performanceMonitor = new PerformanceMonitor();
    this.isInitialized = false;
    this.updatePromptCount = 0;
    this.lastUpdateTime = null;
    
    // Configuration
    this.config = {
      autoUpdateCheck: true,
      updateCheckInterval: 30000, // 30 seconds
      maxUpdatePrompts: 5, // Max prompts per session
      updatePromptCooldown: 60000, // 1 minute cooldown
      enableNotifications: true,
      enableAnalytics: true
    };
    
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Production App...');
    
    try {
      // Initialize cache busting manager
      await this.cacheBustingManager.initialize();
      
      // Start performance monitoring
      this.performanceMonitor.start();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set up periodic update checks
      if (this.config.autoUpdateCheck) {
        this.setupPeriodicUpdateChecks();
      }
      
      // Update UI
      this.updateUI();
      
      this.isInitialized = true;
      console.log('✅ Production App initialized successfully');
      
      // Notify that app is ready
      this.notifyAppReady();
    } catch (error) {
      console.error('❌ Failed to initialize Production App:', error);
      this.handleInitializationError(error);
    }
  }

  setupEventListeners() {
    // Listen for update prompt events
    this.cacheBustingManager.onUpdatePrompt((event) => {
      this.handleUpdatePrompt(event);
    });

    // Listen for performance metrics updates
    this.performanceMonitor.onMetricsUpdate((metrics) => {
      this.updatePerformanceMetrics(metrics);
    });

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.handleOnlineStatusChange(false);
    });
  }

  setupPeriodicUpdateChecks() {
    setInterval(async () => {
      try {
        await this.checkForUpdates();
      } catch (error) {
        console.error('Periodic update check failed:', error);
      }
    }, this.config.updateCheckInterval);
  }

  async checkForUpdates() {
    // Check if we should trigger an update
    const shouldUpdate = await this.shouldTriggerUpdate();
    
    if (shouldUpdate) {
      console.log('🔄 Update needed, executing strategies...');
      await this.executeUpdateStrategies();
    }
  }

  async shouldTriggerUpdate() {
    // Check various conditions to determine if update should be triggered
    
    // Check if we've exceeded max update prompts
    if (this.updatePromptCount >= this.config.maxUpdatePrompts) {
      return false;
    }
    
    // Check cooldown period
    if (this.lastUpdateTime && 
        (Date.now() - this.lastUpdateTime) < this.config.updatePromptCooldown) {
      return false;
    }
    
    // Check if user is active
    if (document.hidden) {
      return false;
    }
    
    // Check if online
    if (!navigator.onLine) {
      return false;
    }
    
    // For demo purposes, trigger update with 20% probability
    return Math.random() > 0.8;
  }

  async executeUpdateStrategies() {
    try {
      // Execute the most effective strategy first
      const result = await this.cacheBustingManager.executeMostEffectiveStrategy();
      
      if (result.success) {
        this.updatePromptCount++;
        this.lastUpdateTime = Date.now();
        
        // Log the update
        this.logUpdateEvent(result);
        
        // Update UI
        this.updateUI();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to execute update strategies:', error);
      return { success: false, error: error.message };
    }
  }

  handleUpdatePrompt(event) {
    console.log('🚨 Update prompt triggered:', event);
    
    // Check if we should show the prompt
    if (!this.shouldShowUpdatePrompt(event)) {
      return;
    }
    
    // Show update prompt notification
    this.showUpdatePromptNotification(event);
    
    // Update metrics
    this.updateUI();
    
    // Log the event
    this.logUpdateEvent(event);
  }

  shouldShowUpdatePrompt(event) {
    // Check if we've exceeded max prompts
    if (this.updatePromptCount >= this.config.maxUpdatePrompts) {
      return false;
    }
    
    // Check cooldown period
    if (this.lastUpdateTime && 
        (Date.now() - this.lastUpdateTime) < this.config.updatePromptCooldown) {
      return false;
    }
    
    // Check if user is active
    if (document.hidden) {
      return false;
    }
    
    return true;
  }

  showUpdatePromptNotification(event) {
    if (!this.config.enableNotifications) {
      return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'update-notification production';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 1000;
      max-width: 350px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .update-notification.production {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
      `;
      document.head.appendChild(style);
    }
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="font-size: 24px; margin-right: 10px;">🚨</div>
        <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Update Available</h4>
      </div>
      <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
        <strong>Strategy:</strong> ${this.formatStrategyName(event.strategy)}<br>
        <strong>Time:</strong> ${new Date(event.timestamp).toLocaleTimeString()}
      </p>
      <div style="display: flex; gap: 10px;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
           onmouseout="this.style.background='rgba(255,255,255,0.2)'">Dismiss</button>
        <button onclick="window.productionApp.refreshApp()" style="
          background: rgba(255,255,255,0.9);
          border: none;
          color: #667eea;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        " onmouseover="this.style.background='white'" 
           onmouseout="this.style.background='rgba(255,255,255,0.9)'">Refresh</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      }
    }, 15000);
  }

  formatStrategyName(strategy) {
    const strategyNames = {
      'service-worker-version-bump': 'Service Worker Update',
      'cache-signature-invalidation': 'Cache Signature Update',
      'user-agent-fingerprint-busting': 'Session Refresh',
      'conditional-request-bypass': 'Cache Bypass',
      'service-worker-update': 'Service Worker Update'
    };
    
    return strategyNames[strategy] || strategy;
  }

  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'PERFORMANCE_METRICS':
        this.updatePerformanceMetrics(data.metrics);
        break;
      case 'CACHE_INFO':
        this.updateCacheInfo(data);
        break;
    }
  }

  handleVisibilityChange() {
    if (!document.hidden) {
      // User became active, check for updates
      this.checkForUpdates();
    }
  }

  handleOnlineStatusChange(isOnline) {
    if (isOnline) {
      console.log('🌐 Back online, checking for updates...');
      this.checkForUpdates();
    } else {
      console.log('📴 Offline, pausing update checks...');
    }
  }

  updateUI() {
    // Update performance metrics
    const metrics = this.performanceMonitor.getCurrentMetrics();
    this.updatePerformanceMetrics(metrics);
    
    // Update cache busting status
    this.updateCacheBustingStatus();
    
    // Update update prompt count
    this.updateUpdatePromptCount();
  }

  updatePerformanceMetrics(metrics) {
    // Update performance metrics in UI
    const elements = {
      'cache-hit-ratio': `${(metrics.cacheHitRatio * 100).toFixed(1)}%`,
      'load-time': `${metrics.loadTime.toFixed(2)}ms`,
      'bandwidth': `${(metrics.bandwidthUsage / 1024).toFixed(2)}KB`,
      'memory-usage': `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`
    };
    
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  updateCacheBustingStatus() {
    const status = this.cacheBustingManager.getStatus();
    const statusElement = document.getElementById('cache-busting-status');
    
    if (statusElement) {
      statusElement.textContent = status.initialized ? 'Active' : 'Inactive';
      statusElement.className = status.initialized ? 'status active' : 'status inactive';
    }
  }

  updateUpdatePromptCount() {
    const countElement = document.getElementById('update-prompt-count');
    if (countElement) {
      countElement.textContent = this.updatePromptCount;
    }
  }

  updateCacheInfo(cacheInfo) {
    // Update cache information in UI
    const cacheInfoElement = document.getElementById('cache-info');
    if (cacheInfoElement) {
      const totalEntries = Object.values(cacheInfo).reduce((sum, cache) => sum + cache.size, 0);
      cacheInfoElement.textContent = `${totalEntries} entries`;
    }
  }

  logUpdateEvent(event) {
    if (!this.config.enableAnalytics) {
      return;
    }
    
    // Log update event for analytics
    const logData = {
      timestamp: Date.now(),
      strategy: event.strategy,
      success: event.success || true,
      details: event.details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // In production, this would send to analytics service
    console.log('📊 Update event logged:', logData);
  }

  notifyAppReady() {
    // Dispatch custom event when app is ready
    window.dispatchEvent(new CustomEvent('production-app-ready', {
      detail: {
        app: this,
        timestamp: Date.now()
      }
    }));
  }

  handleInitializationError(error) {
    // Handle initialization errors gracefully
    console.error('App initialization failed:', error);
    
    // Show error notification
    this.showErrorNotification('Failed to initialize app. Some features may not work properly.');
  }

  showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <h4>❌ Error</h4>
      <p>${message}</p>
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

  // Public API methods

  async refreshApp() {
    console.log('🔄 Refreshing app...');
    
    // Clear caches
    await this.cacheBustingManager.cacheBuster?.clearAllCaches();
    
    // Reload page
    window.location.reload();
  }

  async executeAllStrategies() {
    console.log('🚀 Executing all cache busting strategies...');
    
    const results = await this.cacheBustingManager.executeAllStrategies();
    console.log('Strategy execution results:', results);
    
    return results;
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      updatePromptCount: this.updatePromptCount,
      lastUpdateTime: this.lastUpdateTime,
      config: this.config,
      cacheBustingStatus: this.cacheBustingManager.getStatus()
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.cacheBustingManager.updateConfig(newConfig);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.productionApp = new ProductionApp();
});

// Make functions globally available
window.refreshApp = () => window.productionApp.refreshApp();
window.executeAllStrategies = () => window.productionApp.executeAllStrategies();
window.getAppStatus = () => window.productionApp.getStatus();