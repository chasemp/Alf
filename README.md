# PWA Cache Busting Investigation Platform

A comprehensive research platform for testing cache busting strategies that trigger immediate PWA update prompts by making cached content appear "new" to the system.

## 🎯 Problem Statement

Your PWA currently only prompts users for updates after a minute or so, likely due to:
- Service worker cache strategies prioritizing cached content
- Browser cache mechanisms serving stale content
- Update detection relying on natural cache expiration
- Lack of immediate freshness indicators

**Goal**: Trigger immediate update prompts by making the cache system believe content is fresh/new, forcing it to refresh from source and detect updates immediately.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open PWA in Browser
Navigate to `http://localhost:5173` and install the PWA to test cache busting strategies.

### 4. Run Tests
```bash
# Run comprehensive test suite
node scripts/run-cache-busting-tests.js

# Or use the web interface buttons
```

## 🧪 Testing Strategies

### Update Prompt Trigger Strategies

#### 1. Service Worker Version Bump
```javascript
// Incrementally updates service worker version
const CACHE_VERSION = 'v1.0.1'; // Increment from v1.0.0
```
**Expected Result**: Immediate service worker update triggers app refresh

#### 2. Cache Signature Invalidation
```javascript
// Modify cache signatures to force fresh requests
const signatures = {
  'main.js': 'abc123_modified_' + Date.now(),
  'style.css': 'def456_modified_' + Date.now()
};
```
**Expected Result**: Cache system detects signature changes and fetches fresh content

#### 3. ETag Regeneration
```javascript
// Generate new ETags to force fresh content requests
const newETags = await generateNewETags(currentETags);
```
**Expected Result**: Conditional requests fail ETag validation, forcing fresh fetch

#### 4. Last-Modified Spoofing
```javascript
// Spoof Last-Modified headers to make content appear recently updated
const spoofedDates = generateSpoofedDates(currentLastModified);
```
**Expected Result**: System believes content is fresh, triggers update detection

#### 5. Prefetch with Fresh Headers
```javascript
// Prefetch resources with headers that bypass cache
const freshHeaders = {
  'Cache-Control': 'no-cache',
  'X-Fresh-Request': 'true',
  'X-Timestamp': Date.now().toString()
};
```
**Expected Result**: Fresh content loaded in background, triggers update detection

### Cache Freshness Experiments

#### 1. Cache Timestamp Manipulation
Manipulate cache timestamps to make content appear freshly cached.

#### 2. Network Condition Simulation
Simulate network conditions that trigger cache bypass.

#### 3. User Agent Fingerprint Busting
Modify user agent fingerprint to appear as new client.

#### 4. Time-based Cache Expiry
Manipulate cache expiry times to force immediate refresh.

## 🔬 Advanced Testing Framework

### Web Interface Testing

1. **Basic Cache Busting Tests**
   - Click "Test Cache Busting" to run traditional strategies
   - Click "Run Benchmarks" for performance analysis
   - Click "Analyze Performance" for detailed metrics

2. **Advanced Update Prompt Testing**
   - Click "Test Update Prompt Strategies" to test 8 advanced strategies
   - Click "Test Cache Freshness Experiments" to run 8 cache manipulation experiments
   - Click "Run Complete Investigation" for comprehensive analysis

3. **Real-time Monitoring**
   - Watch for update prompt notifications in the top-right corner
   - Monitor performance metrics in real-time
   - Track service worker status changes

### Command Line Testing

```bash
# Run comprehensive test suite
node scripts/run-cache-busting-tests.js

# This will:
# 1. Test all update prompt trigger strategies
# 2. Run cache freshness experiments
# 3. Perform complete investigation
# 4. Analyze performance impact
# 5. Generate HTML and JSON reports
```

### Programmatic Testing

```javascript
import { CacheBustingInvestigation } from './src/integration/CacheBustingInvestigation.js';

const investigation = new CacheBustingInvestigation();
const results = await investigation.runCompleteInvestigation();

console.log('Investigation Results:', results);
```

## 📊 Test Results & Metrics

### Success Metrics
- **Update Prompt Trigger Rate**: Percentage of successful update prompt triggers
- **Time to Update Detection**: Time from strategy execution to update prompt
- **User Update Acceptance Rate**: Percentage of users who accept updates

### Performance Metrics
- **Load Time Impact**: Effect on app loading performance
- **Memory Usage**: RAM consumption changes
- **Cache Hit Ratio**: Efficiency of cache strategies
- **Bandwidth Usage**: Data transfer optimization

### User Experience Metrics
- **Update Prompt Frequency**: How often users see update prompts
- **User Confusion Levels**: Impact on user understanding
- **Perceived Performance**: User experience quality
- **Satisfaction Scores**: Overall user satisfaction

## 🎛️ Configuration Options

### Service Worker Configuration
```javascript
// sw.js - Configure cache strategies
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cache-busting-research-${CACHE_VERSION}`;

// Choose caching strategy:
// - 'cache-first': Offline-first approach
// - 'network-first': Freshness-first approach  
// - 'stale-while-revalidate': Balanced approach
```

### Test Configuration
```javascript
// Configure test parameters
const testConfig = {
  updatePromptFrequency: 'immediate', // or 'delayed'
  cacheStrategy: 'stale-while-revalidate',
  performanceThreshold: 1000, // ms
  userExperienceMode: 'aggressive' // or 'conservative'
};
```

## 🔍 Investigation Phases

### Phase 1: Baseline Analysis
- Document current cache behavior
- Establish performance benchmarks
- Identify update detection mechanisms

### Phase 2: Strategy Testing
- Test individual cache busting strategies
- Measure effectiveness of each approach
- Identify optimal parameters

### Phase 3: Integration Testing
- Test strategy combinations
- Real-world scenario testing
- Cross-browser compatibility

### Phase 4: Performance Analysis
- Analyze performance impact
- User experience assessment
- Bandwidth usage analysis

## 📈 Expected Results

### Target Metrics
- **Update Prompt Trigger Rate**: >80%
- **Time to Update Detection**: <5 seconds
- **Performance Impact**: <10% increase in load time
- **User Acceptance Rate**: >70%

### Success Indicators
- ✅ Immediate update prompts triggered
- ✅ Fresh content loaded from source
- ✅ Minimal performance impact
- ✅ Positive user experience

## 🛠️ Development

### Project Structure
```
/
├── src/
│   ├── strategies/           # Update prompt trigger strategies
│   ├── experiments/         # Cache freshness experiments
│   ├── integration/         # Comprehensive investigation framework
│   ├── service-workers/     # Service worker management
│   └── utils/               # Testing utilities
├── tests/                   # Test suites
├── scripts/                 # Test runners and automation
└── docs/                    # Documentation and reports
```

### Adding New Strategies

1. **Create Strategy Class**
```javascript
// src/strategies/NewStrategy.js
export class NewStrategy {
  async execute() {
    // Implement strategy logic
    return { success: true, details: {} };
  }
}
```

2. **Add to Update Prompt Trigger**
```javascript
// src/strategies/UpdatePromptTrigger.js
this.strategies['new-strategy'] = this.newStrategy.bind(this);
```

3. **Create Tests**
```javascript
// tests/NewStrategy.test.js
describe('NewStrategy', () => {
  test('should execute successfully', async () => {
    const strategy = new NewStrategy();
    const result = await strategy.execute();
    expect(result.success).toBe(true);
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- UpdatePromptTrigger.test.js

# Run with coverage
npm run test:coverage
```

## 🚨 Troubleshooting

### Common Issues

1. **Service Worker Not Updating**
   - Check browser developer tools > Application > Service Workers
   - Ensure `skipWaiting()` is called in install event
   - Clear browser cache and reload

2. **Update Prompts Not Triggering**
   - Verify service worker is registered
   - Check console for error messages
   - Ensure strategies are executing successfully

3. **Performance Issues**
   - Monitor memory usage in developer tools
   - Check network tab for excessive requests
   - Adjust cache strategy parameters

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');

// Check service worker status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Worker Registrations:', registrations);
});
```

## 📚 Documentation

- [Cache Busting Investigation Plan](./PWA_CACHE_BUSTING_INVESTIGATION_PLAN.md)
- [Original Research Plan](./CACHE_BUSTING_RESEARCH_PLAN.md)
- [API Documentation](./docs/api.md)
- [Strategy Guide](./docs/strategies.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your strategy or experiment
4. Add comprehensive tests
5. Submit a pull request

### Contribution Guidelines
- Follow existing code style
- Add tests for new functionality
- Update documentation
- Ensure cross-browser compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Service Worker API documentation
- PWA best practices community
- Cache busting research contributors
- Browser vendor implementations

---

**Ready to test?** Start with the web interface by clicking "Test Update Prompt Strategies" or run the comprehensive test suite with `node scripts/run-cache-busting-tests.js`!