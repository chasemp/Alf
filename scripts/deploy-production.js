#!/usr/bin/env node

/**
 * Production Deployment Script
 * Deploys the production-ready cache busting PWA
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting production deployment...');

// Configuration
const config = {
  sourceDir: './',
  buildDir: './dist',
  productionFiles: [
    'production.html',
    'src/production/ProductionApp.js',
    'src/production/CacheBustingManager.js',
    'src/production/ProductionServiceWorker.js',
    'sw-production.js',
    'src/utils/PerformanceMonitor.js',
    'manifest.json'
  ],
  staticFiles: [
    'index.html',
    'src/main.js',
    'src/utils/CacheBuster.js',
    'src/utils/PerformanceMonitor.js',
    'src/service-workers/ServiceWorkerManager.js',
    'src/strategies/UpdatePromptTrigger.js',
    'src/experiments/CacheFreshnessExperiment.js',
    'src/integration/CacheBustingInvestigation.js',
    'sw.js',
    'manifest.json'
  ]
};

// Create build directory
function createBuildDir() {
  console.log('📁 Creating build directory...');
  
  if (!fs.existsSync(config.buildDir)) {
    fs.mkdirSync(config.buildDir, { recursive: true });
  }
  
  // Create subdirectories
  const subdirs = ['src/production', 'src/utils', 'src/service-workers', 'src/strategies', 'src/experiments', 'src/integration'];
  subdirs.forEach(subdir => {
    const fullPath = path.join(config.buildDir, subdir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

// Copy production files
function copyProductionFiles() {
  console.log('📋 Copying production files...');
  
  config.productionFiles.forEach(file => {
    const sourcePath = path.join(config.sourceDir, file);
    const destPath = path.join(config.buildDir, file);
    
    if (fs.existsSync(sourcePath)) {
      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file}`);
    } else {
      console.warn(`⚠️  File not found: ${file}`);
    }
  });
}

// Copy static files
function copyStaticFiles() {
  console.log('📋 Copying static files...');
  
  config.staticFiles.forEach(file => {
    const sourcePath = path.join(config.sourceDir, file);
    const destPath = path.join(config.buildDir, file);
    
    if (fs.existsSync(sourcePath)) {
      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file}`);
    } else {
      console.warn(`⚠️  File not found: ${file}`);
    }
  });
}

// Update service worker for production
function updateServiceWorkerForProduction() {
  console.log('🔧 Updating service worker for production...');
  
  const swPath = path.join(config.buildDir, 'sw.js');
  const swProductionPath = path.join(config.buildDir, 'sw-production.js');
  
  if (fs.existsSync(swProductionPath)) {
    // Copy production service worker as main service worker
    fs.copyFileSync(swProductionPath, swPath);
    console.log('✅ Updated service worker for production');
  } else {
    console.warn('⚠️  Production service worker not found');
  }
}

// Update HTML files for production
function updateHTMLForProduction() {
  console.log('🔧 Updating HTML files for production...');
  
  // Update production.html to use correct service worker
  const productionHTMLPath = path.join(config.buildDir, 'production.html');
  if (fs.existsSync(productionHTMLPath)) {
    let content = fs.readFileSync(productionHTMLPath, 'utf8');
    
    // Update service worker registration
    content = content.replace(
      /navigator\.serviceWorker\.register\('\/sw\.js'\)/g,
      "navigator.serviceWorker.register('/sw.js')"
    );
    
    // Update script sources
    content = content.replace(
      /src="\/src\/production\/ProductionApp\.js"/g,
      'src="/src/production/ProductionApp.js"'
    );
    
    fs.writeFileSync(productionHTMLPath, content);
    console.log('✅ Updated production.html');
  }
  
  // Update index.html to use correct service worker
  const indexHTMLPath = path.join(config.buildDir, 'index.html');
  if (fs.existsSync(indexHTMLPath)) {
    let content = fs.readFileSync(indexHTMLPath, 'utf8');
    
    // Update service worker registration
    content = content.replace(
      /navigator\.serviceWorker\.register\('\/sw\.js'\)/g,
      "navigator.serviceWorker.register('/sw.js')"
    );
    
    fs.writeFileSync(indexHTMLPath, content);
    console.log('✅ Updated index.html');
  }
}

// Create production manifest
function createProductionManifest() {
  console.log('📱 Creating production manifest...');
  
  const manifest = {
    name: "Production PWA Cache Busting",
    short_name: "CacheBusting",
    description: "Production-ready PWA with advanced cache busting strategies",
    start_url: "/production.html",
    display: "standalone",
    background_color: "#667eea",
    theme_color: "#667eea",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    categories: ["productivity", "utilities"],
    lang: "en",
    scope: "/",
    id: "production-cache-busting-pwa"
  };
  
  const manifestPath = path.join(config.buildDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Created production manifest');
}

// Create deployment info
function createDeploymentInfo() {
  console.log('📊 Creating deployment info...');
  
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    buildType: 'production',
    strategies: [
      'Service Worker Version Bump',
      'Cache Signature Invalidation',
      'User Agent Fingerprint Busting',
      'Conditional Request Bypass'
    ],
    features: [
      'Advanced cache busting',
      'Performance monitoring',
      'Update prompt triggers',
      'Production-ready service worker'
    ],
    files: {
      production: config.productionFiles,
      static: config.staticFiles
    }
  };
  
  const infoPath = path.join(config.buildDir, 'deployment-info.json');
  fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('✅ Created deployment info');
}

// Deploy to GitHub Pages
function deployToGitHubPages() {
  console.log('🚀 Deploying to GitHub Pages...');
  
  try {
    // Check if gh-pages is available
    execSync('which gh-pages', { stdio: 'pipe' });
    
    // Deploy to GitHub Pages
    execSync(`gh-pages -d ${config.buildDir}`, { stdio: 'inherit' });
    console.log('✅ Deployed to GitHub Pages');
  } catch (error) {
    console.warn('⚠️  GitHub Pages deployment failed:', error.message);
    console.log('💡 You can manually deploy by copying the dist/ folder to your web server');
  }
}

// Main deployment function
async function deploy() {
  try {
    console.log('🚀 Starting production deployment...');
    
    // Create build directory
    createBuildDir();
    
    // Copy files
    copyProductionFiles();
    copyStaticFiles();
    
    // Update files for production
    updateServiceWorkerForProduction();
    updateHTMLForProduction();
    
    // Create production files
    createProductionManifest();
    createDeploymentInfo();
    
    console.log('✅ Production build completed successfully!');
    console.log(`📁 Build directory: ${config.buildDir}`);
    console.log('🌐 You can now deploy the contents of the dist/ folder to your web server');
    
    // Ask if user wants to deploy to GitHub Pages
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to deploy to GitHub Pages? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        deployToGitHubPages();
      } else {
        console.log('💡 Manual deployment: Copy the dist/ folder to your web server');
      }
      rl.close();
    });
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deploy();
}

module.exports = { deploy, config };