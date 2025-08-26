// ============================================================================
// DEBUG CORE - Consolidated Core Debugging Utilities
// ============================================================================
// Combines: debug.js, debug-current-state.js, extension-test.js, 
// console-test.js, quick-test.js, diagnose-extension.js

console.log('🔧 Debug Core loaded - Core debugging utilities available');

// ============================================================================
// CORE DEBUG FUNCTIONS
// ============================================================================

const DebugCore = {
  
  // ============================================================================
  // BASIC DEBUG UTILITIES
  // ============================================================================
  
  log(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] 🔍 ${message}`, data || '');
  },
  
  error(message, error = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] ❌ ${message}`, error || '');
  },
  
  warn(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`[${timestamp}] ⚠️ ${message}`, data || '');
  },
  
  success(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ✅ ${message}`, data || '');
  },
  
  // ============================================================================
  // EXTENSION LOADING TESTS
  // ============================================================================
  
  testExtensionLoading() {
    console.log('\n🔌 Testing Extension Loading...');
    
    // Test 1: Chrome extension availability
    if (typeof chrome === 'undefined') {
      console.log('❌ Chrome extension not available');
      return false;
    } else {
      console.log('✅ Chrome extension available');
    }
    
    // Test 2: Chrome runtime availability
    if (!chrome.runtime) {
      console.log('❌ Chrome runtime not available');
      return false;
    } else {
      console.log('✅ Chrome runtime available');
    }
    
    // Test 3: Extension ID
    if (chrome.runtime.id) {
      console.log('✅ Extension ID:', chrome.runtime.id);
    } else {
      console.log('❌ Extension ID not available');
    }
    
    return true;
  },
  
  // ============================================================================
  // CONTENT SCRIPT DETECTION
  // ============================================================================
  
  testContentScriptLoading() {
    console.log('\n📜 Testing Content Script Loading...');
    
    const contentScriptLoaded = document.documentElement.getAttribute('data-cliffdive-analytics');
    if (contentScriptLoaded === 'loaded') {
      console.log('✅ Content script loaded');
      return true;
    } else {
      console.log('❌ Content script not loaded');
      return false;
    }
  },
  
  // ============================================================================
  // PLATFORM DETECTION
  // ============================================================================
  
  testPlatformDetection() {
    console.log('\n🎯 Testing Platform Detection...');
    
    const hostname = window.location.hostname;
    console.log('Current hostname:', hostname);
    
    // Check for supported platforms
    const supportedPlatforms = [
      'chatgpt.com', 'chat.openai.com', 'claude.ai', 'gemini.google.com',
      'perplexity.ai', 'poe.com', 'grok.x.ai', 'copilot.microsoft.com',
      'bing.com', 'bard.google.com', 'you.com', 'phind.com', 'pi.ai',
      'character.ai', 'huggingface.co', 'deepai.org', 'replicate.com',
      'runwayml.com', 'midjourney.com', 'stability.ai', 'leonardo.ai',
      'gamma.app', 'tome.app', 'beautiful.ai', 'synthesia.io', 'descript.com',
      'elevenlabs.io', 'play.ht', 'jasper.ai', 'copy.ai', 'writesonic.com',
      'rytr.me', 'simplified.co', 'surgegraph.com', 'surfer.com',
      'clearscope.io', 'ahrefs.com', 'semrush.com'
    ];
    
    const isSupported = supportedPlatforms.some(platform => 
      hostname.includes(platform)
    );
    
    if (isSupported) {
      console.log('✅ Platform is supported');
      return true;
    } else {
      console.log('❌ Platform not supported');
      return false;
    }
  },
  
  // ============================================================================
  // ANALYTICS OBJECT DETECTION
  // ============================================================================
  
  testAnalyticsObject() {
    console.log('\n📊 Testing Analytics Object...');
    
    if (window.cliffDiveAnalytics) {
      console.log('✅ Analytics object found');
      console.log('   Platform:', window.cliffDiveAnalytics.platform);
      console.log('   Detector:', window.cliffDiveAnalytics);
      return true;
    } else {
      console.log('❌ Analytics object not found');
      return false;
    }
  },
  
  // ============================================================================
  // BACKGROUND SCRIPT COMMUNICATION
  // ============================================================================
  
  async testBackgroundCommunication() {
    console.log('\n📡 Testing Background Script Communication...');
    
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      console.log('✅ Background script communication working');
      console.log('Response received:', response ? 'Yes' : 'No');
      return true;
    } catch (error) {
      console.log('❌ Background script communication failed:', error.message);
      return false;
    }
  },
  
  // ============================================================================
  // STORAGE ACCESS
  // ============================================================================
  
  async testStorageAccess() {
    console.log('\n💾 Testing Storage Access...');
    
    try {
      const result = await chrome.storage.local.get(['usageData']);
      console.log('✅ Storage access working');
      console.log('Data available:', result.usageData ? 'Yes' : 'No');
      return true;
    } catch (error) {
      console.log('❌ Storage access failed:', error.message);
      return false;
    }
  },
  
  // ============================================================================
  // CURRENT STATE SNAPSHOT
  // ============================================================================
  
  async getCurrentState() {
    console.log('\n📸 Getting Current State Snapshot...');
    
    const state = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      extension: {
        available: typeof chrome !== 'undefined',
        runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
        id: typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.id : null
      },
      contentScript: {
        loaded: document.documentElement.getAttribute('data-cliffdive-analytics') === 'loaded',
        analyticsObject: !!window.cliffDiveAnalytics,
        platform: window.cliffDiveAnalytics ? window.cliffDiveAnalytics.platform : null
      },
      dom: {
        title: document.title,
        bodyElements: document.body.children.length,
        textareas: document.querySelectorAll('textarea').length,
        inputs: document.querySelectorAll('input').length,
        buttons: document.querySelectorAll('button').length
      }
    };
    
    console.log('📊 Current State:', state);
    return state;
  },
  
  // ============================================================================
  // QUICK DIAGNOSTICS
  // ============================================================================
  
  async runQuickDiagnostics() {
    console.log('\n🚀 Running Quick Diagnostics...');
    
    const results = {
      extensionLoading: this.testExtensionLoading(),
      contentScript: this.testContentScriptLoading(),
      platformDetection: this.testPlatformDetection(),
      analyticsObject: this.testAnalyticsObject(),
      backgroundCommunication: await this.testBackgroundCommunication(),
      storageAccess: await this.testStorageAccess()
    };
    
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    console.log(`\n📊 Quick Diagnostics Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Extension is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Check the logs above for details.');
    }
    
    return results;
  },
  
  // ============================================================================
  // EXTENSION DIAGNOSIS
  // ============================================================================
  
  async diagnoseExtension() {
    console.log('\n🔍 Starting Comprehensive Extension Diagnosis...');
    
    const diagnosis = {
      basic: {
        chrome: typeof chrome !== 'undefined',
        runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
        storage: typeof chrome !== 'undefined' && !!chrome.storage
      },
      content: {
        scriptLoaded: document.documentElement.getAttribute('data-cliffdive-analytics') === 'loaded',
        analyticsObject: !!window.cliffDiveAnalytics,
        platform: window.cliffDiveAnalytics ? window.cliffDiveAnalytics.platform : null
      },
      communication: {
        background: false,
        storage: false
      },
      platform: {
        supported: false,
        detected: null
      }
    };
    
    // Test communication
    try {
      await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      diagnosis.communication.background = true;
    } catch (error) {
      console.log('Background communication failed:', error.message);
    }
    
    try {
      await chrome.storage.local.get(['usageData']);
      diagnosis.communication.storage = true;
    } catch (error) {
      console.log('Storage access failed:', error.message);
    }
    
    // Test platform
    const hostname = window.location.hostname;
    const supportedPlatforms = [
      'chatgpt.com', 'chat.openai.com', 'claude.ai', 'gemini.google.com',
      'perplexity.ai', 'poe.com', 'grok.x.ai', 'copilot.microsoft.com',
      'bing.com', 'bard.google.com', 'you.com', 'phind.com', 'pi.ai',
      'character.ai', 'huggingface.co', 'deepai.org', 'replicate.com',
      'runwayml.com', 'midjourney.com', 'stability.ai', 'leonardo.ai',
      'gamma.app', 'tome.app', 'beautiful.ai', 'synthesia.io', 'descript.com',
      'elevenlabs.io', 'play.ht', 'jasper.ai', 'copy.ai', 'writesonic.com',
      'rytr.me', 'simplified.co', 'surgegraph.com', 'surfer.com',
      'clearscope.io', 'ahrefs.com', 'semrush.com'
    ];
    
    diagnosis.platform.supported = supportedPlatforms.some(platform => 
      hostname.includes(platform)
    );
    diagnosis.platform.detected = hostname;
    
    console.log('🔍 Extension Diagnosis Results:', diagnosis);
    
    // Provide recommendations
    this.provideDiagnosisRecommendations(diagnosis);
    
    return diagnosis;
  },
  
  // ============================================================================
  // DIAGNOSIS RECOMMENDATIONS
  // ============================================================================
  
  provideDiagnosisRecommendations(diagnosis) {
    console.log('\n💡 Recommendations:');
    
    if (!diagnosis.basic.chrome) {
      console.log('❌ Chrome extension not available - Are you on a supported browser?');
    }
    
    if (!diagnosis.basic.runtime) {
      console.log('❌ Chrome runtime not available - Extension may not be properly installed');
    }
    
    if (!diagnosis.content.scriptLoaded) {
      console.log('❌ Content script not loaded - Try refreshing the page');
    }
    
    if (!diagnosis.communication.background) {
      console.log('❌ Background communication failed - Extension may be disabled');
    }
    
    if (!diagnosis.platform.supported) {
      console.log('❌ Platform not supported - Current platform:', diagnosis.platform.detected);
    }
    
    if (diagnosis.basic.chrome && diagnosis.basic.runtime && diagnosis.content.scriptLoaded) {
      console.log('✅ Extension appears to be working correctly');
    }
  },
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },
  
  formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  },
  
  // ============================================================================
  // EXPORT FUNCTIONS
  // ============================================================================
  
  // Make functions available globally
  exportToWindow() {
    window.debugCore = this;
    console.log('🔧 Debug Core functions exported to window.debugCore');
  }
};

// Auto-export to window
DebugCore.exportToWindow();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugCore;
} 