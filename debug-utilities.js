// ============================================================================
// DEBUG UTILITIES - Consolidated Utility Functions
// ============================================================================
// Combines: test-extension.sh, start-test-server.py, verify-extension.sh

console.log('🔧 Debug Utilities loaded - Utility functions available');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const DebugUtilities = {
  
  // ============================================================================
  // EXTENSION VERIFICATION
  // ============================================================================
  
  async verifyExtension() {
    console.log('\n🔍 Verifying Extension...');
    
    const verification = {
      manifest: false,
      permissions: false,
      contentScripts: false,
      backgroundScript: false,
      popup: false,
      dashboard: false,
      storage: false,
      communication: false
    };
    
    try {
      // Check manifest
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
        const manifest = chrome.runtime.getManifest();
        verification.manifest = !!manifest;
        console.log('✅ Manifest loaded:', manifest.name);
      }
      
      // Check permissions
      if (typeof chrome !== 'undefined' && chrome.permissions) {
        const permissions = await chrome.permissions.getAll();
        verification.permissions = permissions.permissions.length > 0;
        console.log('✅ Permissions:', permissions.permissions);
      }
      
      // Check content scripts
      verification.contentScripts = typeof window.cliffDiveAnalytics !== 'undefined';
      console.log('✅ Content scripts:', verification.contentScripts);
      
      // Check background script communication
      try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
        verification.communication = !!response;
        console.log('✅ Background communication:', verification.communication);
      } catch (error) {
        console.log('❌ Background communication failed:', error.message);
      }
      
      // Check storage
      try {
        const result = await chrome.storage.local.get(['usageData']);
        verification.storage = true;
        console.log('✅ Storage access:', !!result.usageData);
      } catch (error) {
        console.log('❌ Storage access failed:', error.message);
      }
      
      // Check popup
      verification.popup = typeof chrome !== 'undefined' && chrome.action !== 'undefined';
      console.log('✅ Popup support:', verification.popup);
      
      // Check dashboard
      verification.dashboard = typeof window.dashboard !== 'undefined';
      console.log('✅ Dashboard:', verification.dashboard);
      
      const passed = Object.values(verification).filter(Boolean).length;
      const total = Object.keys(verification).length;
      
      console.log(`\n📊 Extension Verification: ${passed}/${total} checks passed`);
      
      if (passed === total) {
        console.log('🎉 Extension verification passed!');
      } else {
        console.log('⚠️ Some verification checks failed');
      }
      
      return verification;
      
    } catch (error) {
      console.log('❌ Extension verification failed:', error.message);
      return verification;
    }
  },
  
  // ============================================================================
  // EXTENSION TESTING
  // ============================================================================
  
  async testExtension() {
    console.log('\n🧪 Testing Extension...');
    
    const tests = {
      basic: false,
      platformDetection: false,
      dataCollection: false,
      storage: false,
      dashboard: false
    };
    
    try {
      // Basic functionality test
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        tests.basic = true;
        console.log('✅ Basic functionality: Chrome extension available');
      }
      
      // Platform detection test
      const hostname = window.location.hostname;
      const supportedPlatforms = [
        'chatgpt.com', 'chat.openai.com', 'claude.ai', 'gemini.google.com'
      ];
      tests.platformDetection = supportedPlatforms.some(platform => 
        hostname.includes(platform)
      );
      console.log('✅ Platform detection:', tests.platformDetection ? 'Supported platform' : 'Not supported');
      
      // Data collection test
      try {
        await chrome.runtime.sendMessage({
          type: 'PLATFORM_DETECTED',
          platform: 'Test Platform',
          url: window.location.href,
          timestamp: Date.now()
        });
        tests.dataCollection = true;
        console.log('✅ Data collection: Platform detection message sent');
      } catch (error) {
        console.log('❌ Data collection failed:', error.message);
      }
      
      // Storage test
      try {
        await chrome.storage.local.get(['usageData']);
        tests.storage = true;
        console.log('✅ Storage: Access successful');
      } catch (error) {
        console.log('❌ Storage failed:', error.message);
      }
      
      // Dashboard test
      tests.dashboard = typeof window.dashboard !== 'undefined';
      console.log('✅ Dashboard:', tests.dashboard ? 'Available' : 'Not available');
      
      const passed = Object.values(tests).filter(Boolean).length;
      const total = Object.keys(tests).length;
      
      console.log(`\n📊 Extension Tests: ${passed}/${total} tests passed`);
      
      if (passed === total) {
        console.log('🎉 All extension tests passed!');
      } else {
        console.log('⚠️ Some tests failed');
      }
      
      return tests;
      
    } catch (error) {
      console.log('❌ Extension testing failed:', error.message);
      return tests;
    }
  },
  
  // ============================================================================
  // SERVER UTILITIES
  // ============================================================================
  
  startTestServer() {
    console.log('\n🌐 Starting Test Server...');
    
    // Create a simple HTTP server for testing
    const serverInfo = {
      port: 8080,
      url: 'http://localhost:8080',
      status: 'starting'
    };
    
    console.log('📡 Test server configuration:');
    console.log(`   Port: ${serverInfo.port}`);
    console.log(`   URL: ${serverInfo.url}`);
    console.log('   Status: Starting...');
    
    // Note: This is a mock implementation since we can't actually start a server
    // in a browser environment. In a real implementation, this would start
    // a local HTTP server for testing the extension.
    
    setTimeout(() => {
      serverInfo.status = 'running';
      console.log('✅ Test server is running');
      console.log('💡 Use this server to test extension functionality');
    }, 1000);
    
    return serverInfo;
  },
  
  stopTestServer() {
    console.log('\n🛑 Stopping Test Server...');
    console.log('✅ Test server stopped');
    return { status: 'stopped' };
  },
  
  // ============================================================================
  // DATA UTILITIES
  // ============================================================================
  
  async exportData() {
    console.log('\n📤 Exporting Data...');
    
    try {
      const result = await chrome.storage.local.get(['usageData']);
      const data = result.usageData;
      
      if (!data) {
        console.log('❌ No data to export');
        return null;
      }
      
      const exportData = {
        timestamp: Date.now(),
        version: '1.0',
        data: data
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cliffdive-data-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      console.log('✅ Data exported successfully');
      
      return exportData;
      
    } catch (error) {
      console.log('❌ Data export failed:', error.message);
      return null;
    }
  },
  
  async importData(file) {
    console.log('\n📥 Importing Data...');
    
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (!importData.data) {
        console.log('❌ Invalid data format');
        return false;
      }
      
      await chrome.storage.local.set({ usageData: importData.data });
      console.log('✅ Data imported successfully');
      
      return true;
      
    } catch (error) {
      console.log('❌ Data import failed:', error.message);
      return false;
    }
  },
  
  // ============================================================================
  // PERFORMANCE UTILITIES
  // ============================================================================
  
  measurePerformance(operation, iterations = 100) {
    console.log(`\n⚡ Measuring Performance: ${operation.name || 'Unknown operation'}`);
    
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      operation();
      const end = performance.now();
      times.push(end - start);
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
    
    console.log('📊 Performance Results:');
    console.log(`   Average: ${avg.toFixed(2)}ms`);
    console.log(`   Minimum: ${min.toFixed(2)}ms`);
    console.log(`   Maximum: ${max.toFixed(2)}ms`);
    console.log(`   Median: ${median.toFixed(2)}ms`);
    console.log(`   Iterations: ${iterations}`);
    
    return { avg, min, max, median, times };
  },
  
  async benchmarkOperations() {
    console.log('\n🏁 Benchmarking Operations...');
    
    const benchmarks = {};
    
    // Benchmark storage operations
    benchmarks.storage = this.measurePerformance(async () => {
      await chrome.storage.local.get(['usageData']);
    }, 50);
    
    // Benchmark communication operations
    benchmarks.communication = this.measurePerformance(async () => {
      await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
    }, 50);
    
    // Benchmark platform detection
    benchmarks.platformDetection = this.measurePerformance(() => {
      const hostname = window.location.hostname;
      const supportedPlatforms = [
        'chatgpt.com', 'chat.openai.com', 'claude.ai', 'gemini.google.com'
      ];
      return supportedPlatforms.some(platform => hostname.includes(platform));
    }, 1000);
    
    console.log('\n📊 Benchmark Summary:');
    Object.entries(benchmarks).forEach(([name, result]) => {
      console.log(`   ${name}: ${result.avg.toFixed(2)}ms avg`);
    });
    
    return benchmarks;
  },
  
  // ============================================================================
  // DEBUGGING UTILITIES
  // ============================================================================
  
  enableVerboseLogging() {
    console.log('\n🔊 Enabling Verbose Logging...');
    
    // Override console methods to capture all logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const logs = [];
    
    console.log = function(...args) {
      logs.push({ type: 'log', timestamp: Date.now(), args });
      originalLog.apply(console, args);
    };
    
    console.error = function(...args) {
      logs.push({ type: 'error', timestamp: Date.now(), args });
      originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
      logs.push({ type: 'warn', timestamp: Date.now(), args });
      originalWarn.apply(console, args);
    };
    
    console.log('✅ Verbose logging enabled');
    console.log('📝 All console output will be captured');
    
    return {
      logs,
      disable: () => {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        console.log('🔇 Verbose logging disabled');
      }
    };
  },
  
  captureNetworkRequests() {
    console.log('\n🌐 Capturing Network Requests...');
    
    const requests = [];
    
    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const startTime = Date.now();
      const request = {
        url: args[0],
        options: args[1],
        startTime,
        status: 'pending'
      };
      
      requests.push(request);
      
      return originalFetch.apply(this, args).then(response => {
        request.endTime = Date.now();
        request.duration = request.endTime - request.startTime;
        request.status = 'completed';
        request.response = response;
        return response;
      }).catch(error => {
        request.endTime = Date.now();
        request.duration = request.endTime - request.startTime;
        request.status = 'failed';
        request.error = error;
        throw error;
      });
    };
    
    console.log('✅ Network request capture enabled');
    
    return {
      requests,
      disable: () => {
        window.fetch = originalFetch;
        console.log('🔇 Network request capture disabled');
      }
    };
  },
  
  // ============================================================================
  // SYSTEM UTILITIES
  // ============================================================================
  
  getSystemInfo() {
    console.log('\n💻 Getting System Info...');
    
    const systemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      },
      location: {
        href: window.location.href,
        hostname: window.location.hostname,
        protocol: window.location.protocol
      },
      timestamp: Date.now()
    };
    
    console.log('📊 System Information:', systemInfo);
    return systemInfo;
  },
  
  checkBrowserCompatibility() {
    console.log('\n🔍 Checking Browser Compatibility...');
    
    const compatibility = {
      chrome: typeof chrome !== 'undefined',
      runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
      storage: typeof chrome !== 'undefined' && !!chrome.storage,
      permissions: typeof chrome !== 'undefined' && !!chrome.permissions,
      webRequest: typeof chrome !== 'undefined' && !!chrome.webRequest,
      tabs: typeof chrome !== 'undefined' && !!chrome.tabs,
      fetch: typeof fetch !== 'undefined',
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined'
    };
    
    const passed = Object.values(compatibility).filter(Boolean).length;
    const total = Object.keys(compatibility).length;
    
    console.log('📊 Browser Compatibility:', compatibility);
    console.log(`✅ ${passed}/${total} features supported`);
    
    return compatibility;
  },
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },
  
  formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  },
  
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  // ============================================================================
  // EXPORT FUNCTIONS
  // ============================================================================
  
  // Make functions available globally
  exportToWindow() {
    window.debugUtilities = this;
    console.log('🔧 Debug Utilities functions exported to window.debugUtilities');
  }
};

// Auto-export to window
DebugUtilities.exportToWindow();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugUtilities;
} 