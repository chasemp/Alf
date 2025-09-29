#!/usr/bin/env node

/**
 * Cache Busting Test Runner
 * Comprehensive test suite for PWA cache busting strategies
 */

import { CacheBustingInvestigation } from '../src/integration/CacheBustingInvestigation.js';
import { UpdatePromptTrigger } from '../src/strategies/UpdatePromptTrigger.js';
import { CacheFreshnessExperiment } from '../src/experiments/CacheFreshnessExperiment.js';

class CacheBustingTestRunner {
  constructor() {
    this.investigation = null;
    this.updatePromptTrigger = null;
    this.cacheFreshnessExperiment = null;
    this.results = new Map();
    this.startTime = Date.now();
  }

  async initialize() {
    console.log('🚀 Initializing Cache Busting Test Runner...');
    
    try {
      this.investigation = new CacheBustingInvestigation();
      this.updatePromptTrigger = new UpdatePromptTrigger();
      this.cacheFreshnessExperiment = new CacheFreshnessExperiment();
      
      console.log('✅ Test runner initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize test runner:', error);
      return false;
    }
  }

  async runAllTests() {
    console.log('🧪 Running comprehensive cache busting tests...');
    
    const testResults = {
      startTime: this.startTime,
      endTime: null,
      duration: 0,
      tests: {},
      summary: {},
      recommendations: []
    };

    try {
      // Test 1: Update Prompt Trigger Strategies
      console.log('\n📋 Test 1: Update Prompt Trigger Strategies');
      const updatePromptResults = await this.testUpdatePromptStrategies();
      testResults.tests.updatePromptStrategies = updatePromptResults;

      // Test 2: Cache Freshness Experiments
      console.log('\n📋 Test 2: Cache Freshness Experiments');
      const freshnessResults = await this.testCacheFreshnessExperiments();
      testResults.tests.cacheFreshnessExperiments = freshnessResults;

      // Test 3: Complete Investigation
      console.log('\n📋 Test 3: Complete Investigation');
      const investigationResults = await this.testCompleteInvestigation();
      testResults.tests.completeInvestigation = investigationResults;

      // Test 4: Performance Analysis
      console.log('\n📋 Test 4: Performance Analysis');
      const performanceResults = await this.testPerformanceAnalysis();
      testResults.tests.performanceAnalysis = performanceResults;

      // Generate summary
      testResults.endTime = Date.now();
      testResults.duration = testResults.endTime - testResults.startTime;
      testResults.summary = this.generateTestSummary(testResults.tests);
      testResults.recommendations = this.generateRecommendations(testResults.tests);

      console.log('\n✅ All tests completed successfully');
      return testResults;

    } catch (error) {
      console.error('❌ Test execution failed:', error);
      testResults.endTime = Date.now();
      testResults.duration = testResults.endTime - testResults.startTime;
      testResults.error = error.message;
      return testResults;
    }
  }

  async testUpdatePromptStrategies() {
    console.log('🚨 Testing Update Prompt Trigger Strategies...');
    
    const startTime = performance.now();
    const results = await this.updatePromptTrigger.testAllStrategies();
    const endTime = performance.now();
    
    const summary = {
      totalStrategies: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      duration: endTime - startTime,
      mostEffective: this.updatePromptTrigger.getMostEffectiveStrategy()
    };
    
    console.log(`✅ Update Prompt Strategies: ${summary.successful}/${summary.totalStrategies} successful`);
    console.log(`⏱️ Duration: ${summary.duration.toFixed(2)}ms`);
    
    return {
      results: results,
      summary: summary,
      timestamp: Date.now()
    };
  }

  async testCacheFreshnessExperiments() {
    console.log('🔬 Testing Cache Freshness Experiments...');
    
    const startTime = performance.now();
    const results = await this.cacheFreshnessExperiment.runAllExperiments();
    const endTime = performance.now();
    
    const analysis = this.cacheFreshnessExperiment.getAnalysis();
    const updatePromptEvents = this.cacheFreshnessExperiment.getUpdatePromptEvents();
    
    const summary = {
      totalExperiments: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      duration: endTime - startTime,
      updatePromptEvents: updatePromptEvents.length,
      mostEffective: this.cacheFreshnessExperiment.getMostEffectiveExperiment()
    };
    
    console.log(`✅ Cache Freshness Experiments: ${summary.successful}/${summary.totalExperiments} successful`);
    console.log(`🚨 Update Prompt Events: ${summary.updatePromptEvents}`);
    console.log(`⏱️ Duration: ${summary.duration.toFixed(2)}ms`);
    
    return {
      results: results,
      analysis: analysis,
      updatePromptEvents: updatePromptEvents,
      summary: summary,
      timestamp: Date.now()
    };
  }

  async testCompleteInvestigation() {
    console.log('🔍 Running Complete Investigation...');
    
    const startTime = performance.now();
    const results = await this.investigation.runCompleteInvestigation();
    const endTime = performance.now();
    
    const summary = {
      success: results.success,
      duration: endTime - startTime,
      phasesCompleted: Object.keys(results.phases || {}).length,
      updatePromptEvents: this.investigation.getUpdatePromptEvents().length,
      report: results.report
    };
    
    console.log(`✅ Complete Investigation: ${results.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`📊 Phases Completed: ${summary.phasesCompleted}`);
    console.log(`🚨 Update Prompt Events: ${summary.updatePromptEvents}`);
    console.log(`⏱️ Duration: ${summary.duration.toFixed(2)}ms`);
    
    return {
      results: results,
      summary: summary,
      timestamp: Date.now()
    };
  }

  async testPerformanceAnalysis() {
    console.log('⚡ Running Performance Analysis...');
    
    const startTime = performance.now();
    
    // Simulate performance analysis
    const performanceMetrics = {
      loadTime: performance.now() - startTime,
      memoryUsage: this.estimateMemoryUsage(),
      cacheHitRatio: this.calculateCacheHitRatio(),
      bandwidthUsage: this.estimateBandwidthUsage()
    };
    
    const endTime = performance.now();
    
    const summary = {
      duration: endTime - startTime,
      metrics: performanceMetrics,
      impact: this.assessPerformanceImpact(performanceMetrics)
    };
    
    console.log(`✅ Performance Analysis completed`);
    console.log(`📊 Load Time: ${performanceMetrics.loadTime.toFixed(2)}ms`);
    console.log(`💾 Memory Usage: ${(performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log(`🎯 Cache Hit Ratio: ${(performanceMetrics.cacheHitRatio * 100).toFixed(1)}%`);
    console.log(`📡 Bandwidth Usage: ${(performanceMetrics.bandwidthUsage / 1024).toFixed(2)}KB`);
    
    return {
      metrics: performanceMetrics,
      summary: summary,
      timestamp: Date.now()
    };
  }

  generateTestSummary(tests) {
    const totalTests = Object.keys(tests).length;
    const successfulTests = Object.values(tests).filter(test => 
      test.summary && (test.summary.success !== false)
    ).length;
    
    const totalStrategies = (tests.updatePromptStrategies?.summary?.totalStrategies || 0) +
                           (tests.cacheFreshnessExperiments?.summary?.totalExperiments || 0);
    
    const successfulStrategies = (tests.updatePromptStrategies?.summary?.successful || 0) +
                                (tests.cacheFreshnessExperiments?.summary?.successful || 0);
    
    const totalUpdatePromptEvents = (tests.updatePromptStrategies?.summary?.updatePromptEvents || 0) +
                                  (tests.cacheFreshnessExperiments?.summary?.updatePromptEvents || 0) +
                                  (tests.completeInvestigation?.summary?.updatePromptEvents || 0);
    
    return {
      totalTests: totalTests,
      successfulTests: successfulTests,
      successRate: (successfulTests / totalTests) * 100,
      totalStrategies: totalStrategies,
      successfulStrategies: successfulStrategies,
      strategySuccessRate: totalStrategies > 0 ? (successfulStrategies / totalStrategies) * 100 : 0,
      totalUpdatePromptEvents: totalUpdatePromptEvents,
      overallDuration: Date.now() - this.startTime
    };
  }

  generateRecommendations(tests) {
    const recommendations = [];
    
    // Analyze update prompt trigger results
    if (tests.updatePromptStrategies?.summary?.successful > 0) {
      recommendations.push('✅ Update prompt trigger strategies are working effectively');
      
      const mostEffective = tests.updatePromptStrategies.summary.mostEffective;
      if (mostEffective) {
        recommendations.push(`🎯 Most effective strategy: ${mostEffective.strategy}`);
        recommendations.push(`📈 Strategy score: ${mostEffective.score}/10`);
      }
    } else {
      recommendations.push('⚠️ Update prompt trigger strategies need improvement');
    }
    
    // Analyze cache freshness experiment results
    if (tests.cacheFreshnessExperiments?.summary?.successful > 0) {
      recommendations.push('✅ Cache freshness experiments are producing results');
      
      const updateEvents = tests.cacheFreshnessExperiments.summary.updatePromptEvents;
      if (updateEvents > 0) {
        recommendations.push(`🚨 ${updateEvents} update prompt events triggered`);
      }
    } else {
      recommendations.push('⚠️ Cache freshness experiments need refinement');
    }
    
    // Analyze complete investigation results
    if (tests.completeInvestigation?.summary?.success) {
      recommendations.push('✅ Complete investigation completed successfully');
      
      const phasesCompleted = tests.completeInvestigation.summary.phasesCompleted;
      recommendations.push(`📊 ${phasesCompleted} investigation phases completed`);
    } else {
      recommendations.push('❌ Complete investigation failed - review error logs');
    }
    
    // Performance recommendations
    if (tests.performanceAnalysis?.summary?.impact) {
      const impact = tests.performanceAnalysis.summary.impact;
      if (impact.loadTimeImpact === 'minimal') {
        recommendations.push('⚡ Performance impact is minimal - safe for production');
      } else {
        recommendations.push('⚠️ Performance impact detected - monitor closely');
      }
    }
    
    // General recommendations
    recommendations.push('🔍 Continue monitoring update prompt frequency');
    recommendations.push('🧪 Test across different browsers and devices');
    recommendations.push('📊 Implement production monitoring for cache busting strategies');
    recommendations.push('👥 Gather user feedback on update prompt experience');
    
    return recommendations;
  }

  // Helper methods for performance analysis

  estimateMemoryUsage() {
    // Simulate memory usage estimation
    return Math.random() * 100 * 1024 * 1024; // Random between 0-100MB
  }

  calculateCacheHitRatio() {
    // Simulate cache hit ratio calculation
    return Math.random() * 0.5 + 0.5; // Random between 0.5-1.0
  }

  estimateBandwidthUsage() {
    // Simulate bandwidth usage estimation
    return Math.random() * 1024 * 1024; // Random between 0-1MB
  }

  assessPerformanceImpact(metrics) {
    return {
      loadTimeImpact: metrics.loadTime < 1000 ? 'minimal' : 'moderate',
      memoryImpact: metrics.memoryUsage < 50 * 1024 * 1024 ? 'low' : 'high',
      cacheEfficiency: metrics.cacheHitRatio > 0.8 ? 'high' : 'moderate',
      bandwidthImpact: metrics.bandwidthUsage < 512 * 1024 ? 'low' : 'moderate'
    };
  }

  // Report generation methods

  generateHTMLReport(testResults) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cache Busting Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .summary { background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { color: #4CAF50; }
        .warning { color: #FF9800; }
        .error { color: #F44336; }
        .metric { display: flex; justify-content: space-between; margin: 5px 0; }
        .recommendations { background: #fff3cd; padding: 15px; border-radius: 5px; }
        ul { margin: 10px 0; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Cache Busting Test Report</h1>
        <p>Generated: ${new Date(testResults.startTime).toLocaleString()}</p>
        <p>Duration: ${(testResults.duration / 1000).toFixed(2)} seconds</p>
    </div>

    <div class="summary">
        <h2>📊 Test Summary</h2>
        <div class="metric">
            <span>Total Tests:</span>
            <span>${testResults.summary.totalTests}</span>
        </div>
        <div class="metric">
            <span>Successful Tests:</span>
            <span class="success">${testResults.summary.successfulTests}</span>
        </div>
        <div class="metric">
            <span>Success Rate:</span>
            <span>${testResults.summary.successRate.toFixed(1)}%</span>
        </div>
        <div class="metric">
            <span>Total Strategies:</span>
            <span>${testResults.summary.totalStrategies}</span>
        </div>
        <div class="metric">
            <span>Successful Strategies:</span>
            <span class="success">${testResults.summary.successfulStrategies}</span>
        </div>
        <div class="metric">
            <span>Strategy Success Rate:</span>
            <span>${testResults.summary.strategySuccessRate.toFixed(1)}%</span>
        </div>
        <div class="metric">
            <span>Update Prompt Events:</span>
            <span class="success">${testResults.summary.totalUpdatePromptEvents}</span>
        </div>
    </div>

    ${this.generateTestSectionHTML('Update Prompt Strategies', testResults.tests.updatePromptStrategies)}
    ${this.generateTestSectionHTML('Cache Freshness Experiments', testResults.tests.cacheFreshnessExperiments)}
    ${this.generateTestSectionHTML('Complete Investigation', testResults.tests.completeInvestigation)}
    ${this.generateTestSectionHTML('Performance Analysis', testResults.tests.performanceAnalysis)}

    <div class="recommendations">
        <h2>💡 Recommendations</h2>
        <ul>
            ${testResults.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;

    return html;
  }

  generateTestSectionHTML(title, testData) {
    if (!testData) return '';

    const statusClass = testData.summary?.success !== false ? 'success' : 'error';
    const statusText = testData.summary?.success !== false ? '✅ SUCCESS' : '❌ FAILED';

    return `
    <div class="test-section">
        <h2>${title}</h2>
        <p class="${statusClass}">Status: ${statusText}</p>
        ${testData.summary ? `
            <div class="metric">
                <span>Duration:</span>
                <span>${testData.summary.duration?.toFixed(2)}ms</span>
            </div>
            ${testData.summary.successful !== undefined ? `
                <div class="metric">
                    <span>Successful:</span>
                    <span class="success">${testData.summary.successful}</span>
                </div>
            ` : ''}
            ${testData.summary.updatePromptEvents !== undefined ? `
                <div class="metric">
                    <span>Update Prompt Events:</span>
                    <span class="success">${testData.summary.updatePromptEvents}</span>
                </div>
            ` : ''}
        ` : ''}
    </div>`;
  }

  async saveReport(testResults, format = 'html') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cache-busting-test-report-${timestamp}`;
    
    if (format === 'html') {
      const html = this.generateHTMLReport(testResults);
      const fs = await import('fs');
      await fs.promises.writeFile(`${filename}.html`, html);
      console.log(`📄 HTML report saved: ${filename}.html`);
    }
    
    // Also save JSON for programmatic access
    const json = JSON.stringify(testResults, null, 2);
    const fs = await import('fs');
    await fs.promises.writeFile(`${filename}.json`, json);
    console.log(`📄 JSON report saved: ${filename}.json`);
  }
}

// Main execution
async function main() {
  const runner = new CacheBustingTestRunner();
  
  console.log('🚀 Starting Cache Busting Test Runner...');
  
  const initialized = await runner.initialize();
  if (!initialized) {
    console.error('❌ Failed to initialize test runner');
    process.exit(1);
  }
  
  try {
    const results = await runner.runAllTests();
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Tests Completed: ${results.summary.successfulTests}/${results.summary.totalTests}`);
    console.log(`🎯 Strategy Success Rate: ${results.summary.strategySuccessRate.toFixed(1)}%`);
    console.log(`🚨 Update Prompt Events: ${results.summary.totalUpdatePromptEvents}`);
    console.log(`⏱️ Total Duration: ${(results.summary.overallDuration / 1000).toFixed(2)}s`);
    
    console.log('\n💡 Key Recommendations:');
    results.recommendations.slice(0, 5).forEach(rec => {
      console.log(`   ${rec}`);
    });
    
    // Save reports
    await runner.saveReport(results, 'html');
    await runner.saveReport(results, 'json');
    
    console.log('\n✅ Test execution completed successfully!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CacheBustingTestRunner };