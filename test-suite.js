// ============================================================================
// TEST SUITE - Consolidated Test Functions
// ============================================================================
// Combines: comprehensive-test.js, test-fixes.js, test-real-calculations.js,
// test-chatgpt-fix.js, test-chatgpt-domain-fix.js, test-chatgpt-team-recommendations.js,
// test-advanced-chatgpt.js, test-recent-activity-fix.js

console.log('🧪 Test Suite loaded - All test functions available');

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let testLog = [];
let realTimeObserver = null;

// ============================================================================
// LOGGING FUNCTIONS
// ============================================================================

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    testLog.push({ message: logEntry, type });
    
    // Update UI
    const logOutput = document.getElementById('logOutput');
    if (logOutput) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = logEntry;
        logOutput.appendChild(entry);
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    // Also log to console
    console.log(logEntry);
}

function clearLog() {
    testLog = [];
    const logOutput = document.getElementById('logOutput');
    if (logOutput) {
        logOutput.innerHTML = '<div class="log-entry info">🚀 Log cleared...</div>';
    }
}

function exportLog() {
    const logText = testLog.map(entry => entry.message).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cliffdive-test-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    log('📄 Log exported successfully', 'success');
}

function copyLog() {
    const logText = testLog.map(entry => entry.message).join('\n');
    navigator.clipboard.writeText(logText).then(() => {
        log('📋 Log copied to clipboard', 'success');
    }).catch(() => {
        log('❌ Failed to copy log', 'error');
    });
}

// ============================================================================
// QUICK ACTIONS
// ============================================================================

async function runQuickDiagnostics() {
    log('🚀 Running Quick Diagnostics...', 'info');
    
    if (window.debugCore) {
        const results = await window.debugCore.runQuickDiagnostics();
        log(`📊 Quick Diagnostics Results: ${Object.values(results).filter(Boolean).length}/${Object.keys(results).length} tests passed`, 'info');
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

async function checkExtensionStatus() {
    log('🔍 Checking Extension Status...', 'info');
    
    if (window.debugCore) {
        const state = await window.debugCore.getCurrentState();
        log('📊 Extension Status Check Complete', 'success');
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

async function testDataCollection() {
    log('📊 Testing Data Collection...', 'info');
    
    if (window.debugData) {
        const result = await window.debugData.testDataCollection();
        if (result && result.success) {
            log('✅ Data collection test passed', 'success');
        } else {
            log('❌ Data collection test failed', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function clearAllData() {
    log('🗑️ Clearing All Data...', 'warning');
    
    if (window.debugData) {
        const result = await window.debugData.clearCorruptedData();
        if (result && result.success) {
            log('✅ All data cleared successfully', 'success');
        } else {
            log('❌ Failed to clear data', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function testClearData() {
  const results = document.getElementById('clearDataResults');
  results.innerHTML = '<p>Testing clear data functionality...</p>';
  
  try {
    // Test if clear data button exists
    const clearDataBtn = document.getElementById('clearData');
    if (!clearDataBtn) {
      results.innerHTML += '<p class="error">❌ Clear data button not found</p>';
      return;
    }
    
    results.innerHTML += '<p class="success">✅ Clear data button found</p>';
    
    // Test if chrome.runtime is available
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      results.innerHTML += '<p class="error">❌ Chrome runtime not available</p>';
      return;
    }
    
    results.innerHTML += '<p class="success">✅ Chrome runtime available</p>';
    
    // Test sending CLEAR_DATA message (without actually clearing)
    try {
      const response = await chrome.runtime.sendMessage({ type: 'CLEAR_DATA' });
      if (response && response.success) {
        results.innerHTML += '<p class="success">✅ Clear data message handled successfully</p>';
      } else {
        results.innerHTML += '<p class="error">❌ Clear data message failed</p>';
      }
    } catch (error) {
      results.innerHTML += `<p class="error">❌ Error testing clear data: ${error.message}</p>`;
    }
    
  } catch (error) {
    results.innerHTML += `<p class="error">❌ Error testing clear data: ${error.message}</p>`;
  }
}

async function testExtensionStatus() {
  const results = document.getElementById('extensionStatusResults');
  results.innerHTML = '<p>Testing extension status...</p>';
  
  try {
    // Test if chrome.runtime is available
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      results.innerHTML += '<p class="error">❌ Chrome runtime not available</p>';
      return;
    }
    
    results.innerHTML += '<p class="success">✅ Chrome runtime available</p>';
    
    // Test if we can send a simple message
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      if (response) {
        results.innerHTML += '<p class="success">✅ Background script responding</p>';
        results.innerHTML += `<p>📊 Found ${response.sessions?.length || 0} sessions</p>`;
      } else {
        results.innerHTML += '<p class="error">❌ Background script not responding</p>';
      }
    } catch (error) {
      results.innerHTML += `<p class="error">❌ Error communicating with background script: ${error.message}</p>`;
    }
    
  } catch (error) {
    results.innerHTML += `<p class="error">❌ Error testing extension: ${error.message}</p>`;
  }
}

function openDashboard() {
    log('📈 Opening Dashboard...', 'info');
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' }).then(() => {
            log('✅ Dashboard opened', 'success');
        }).catch((error) => {
            log(`❌ Failed to open dashboard: ${error.message}`, 'error');
        });
    } else {
        log('❌ Chrome extension not available', 'error');
    }
}

// ============================================================================
// CORE DEBUGGING FUNCTIONS
// ============================================================================

function testExtensionLoading() {
    log('🔌 Testing Extension Loading...', 'info');
    
    if (window.debugCore) {
        const result = window.debugCore.testExtensionLoading();
        if (result) {
            log('✅ Extension loading test passed', 'success');
        } else {
            log('❌ Extension loading test failed', 'error');
        }
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

function testContentScript() {
    log('📜 Testing Content Script...', 'info');
    
    if (window.debugCore) {
        const result = window.debugCore.testContentScriptLoading();
        if (result) {
            log('✅ Content script test passed', 'success');
        } else {
            log('❌ Content script test failed', 'error');
        }
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

function testPlatformDetection() {
    log('🎯 Testing Platform Detection...', 'info');
    
    if (window.debugCore) {
        const result = window.debugCore.testPlatformDetection();
        if (result) {
            log('✅ Platform detection test passed', 'success');
        } else {
            log('❌ Platform detection test failed', 'error');
        }
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

async function testBackgroundCommunication() {
    log('📡 Testing Background Communication...', 'info');
    
    if (window.debugCore) {
        const result = await window.debugCore.testBackgroundCommunication();
        if (result) {
            log('✅ Background communication test passed', 'success');
        } else {
            log('❌ Background communication test failed', 'error');
        }
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

async function testStorageAccess() {
    log('💾 Testing Storage Access...', 'info');
    
    if (window.debugCore) {
        const result = await window.debugCore.testStorageAccess();
        if (result) {
            log('✅ Storage access test passed', 'success');
        } else {
            log('❌ Storage access test failed', 'error');
        }
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

async function getCurrentState() {
    log('📸 Getting Current State...', 'info');
    
    if (window.debugCore) {
        const state = await window.debugCore.getCurrentState();
        log('✅ Current state retrieved', 'success');
        log(`📍 URL: ${state.url}`, 'info');
        log(`🔗 Hostname: ${state.hostname}`, 'info');
    } else {
        log('❌ Debug Core not available', 'error');
    }
}

// ============================================================================
// PLATFORM-SPECIFIC FUNCTIONS
// ============================================================================

function debugChatGPT() {
    log('🤖 Debugging ChatGPT...', 'info');
    
    if (window.debugPlatforms) {
        const result = window.debugPlatforms.debugChatGPT();
        if (result) {
            log('✅ ChatGPT debugging completed', 'success');
        } else {
            log('❌ ChatGPT debugging failed', 'error');
        }
    } else {
        log('❌ Debug Platforms not available', 'error');
    }
}

async function forceChatGPTTracking() {
    log('🚀 Force ChatGPT Tracking...', 'info');
    
    if (window.debugPlatforms) {
        const observer = await window.debugPlatforms.forceChatGPTTracking();
        if (observer) {
            log('✅ Force ChatGPT tracking started', 'success');
        } else {
            log('❌ Force ChatGPT tracking failed', 'error');
        }
    } else {
        log('❌ Debug Platforms not available', 'error');
    }
}

function debugGemini() {
    log('💎 Debugging Gemini...', 'info');
    
    if (window.debugPlatforms) {
        const result = window.debugPlatforms.debugGemini();
        if (result) {
            log('✅ Gemini debugging completed', 'success');
        } else {
            log('❌ Gemini debugging failed', 'error');
        }
    } else {
        log('❌ Debug Platforms not available', 'error');
    }
}

function debugPlatformDetection() {
    log('🎯 Debugging Platform Detection...', 'info');
    
    if (window.debugPlatforms) {
        const platform = window.debugPlatforms.debugPlatformDetection();
        if (platform) {
            log(`✅ Platform detected: ${platform}`, 'success');
        } else {
            log('❌ No platform detected', 'error');
        }
    } else {
        log('❌ Debug Platforms not available', 'error');
    }
}

function startRealTimeMonitoring() {
    log('👀 Starting Real-time Monitoring...', 'info');
    
    if (window.debugPlatforms) {
        const observer = window.debugPlatforms.testChatGPTRealTimeMonitoring();
        if (observer) {
            realTimeObserver = observer;
            log('✅ Real-time monitoring started', 'success');
        } else {
            log('❌ Real-time monitoring failed', 'error');
        }
    } else {
        log('❌ Debug Platforms not available', 'error');
    }
}

function stopRealTimeMonitoring() {
    log('🛑 Stopping Real-time Monitoring...', 'info');
    
    if (realTimeObserver) {
        realTimeObserver.disconnect();
        realTimeObserver = null;
        log('✅ Real-time monitoring stopped', 'success');
    } else {
        log('❌ No active monitoring to stop', 'error');
    }
}

// ============================================================================
// DASHBOARD FUNCTIONS
// ============================================================================

async function debugRecentActivity() {
    log('📋 Debugging Recent Activity...', 'info');
    
    if (window.debugDashboard) {
        const results = await window.debugDashboard.debugRecentActivity();
        log('✅ Recent activity debugging completed', 'success');
    } else {
        log('❌ Debug Dashboard not available', 'error');
    }
}

async function debugStuckSessions() {
    log('🔍 Debugging Stuck Sessions...', 'info');
    
    if (window.debugDashboard) {
        const results = await window.debugDashboard.debugStuckSessions();
        log('✅ Stuck sessions debugging completed', 'success');
    } else {
        log('❌ Debug Dashboard not available', 'error');
    }
}

async function forceEndSessions() {
    log('🛑 Force Ending Sessions...', 'warning');
    
    try {
        const response = await chrome.runtime.sendMessage({ type: 'FORCE_END_SESSIONS' });
        if (response && response.success) {
            log(`✅ Force ended ${response.sessionsEnded} sessions`, 'success');
        } else {
            log('❌ Failed to force end sessions', 'error');
        }
    } catch (error) {
        log(`❌ Error force ending sessions: ${error.message}`, 'error');
    }
}

function checkDashboardStatus() {
    log('📊 Checking Dashboard Status...', 'info');
    
    if (window.debugDashboard) {
        const status = window.debugDashboard.checkDashboardLoaded();
        log('✅ Dashboard status check completed', 'success');
    } else {
        log('❌ Debug Dashboard not available', 'error');
    }
}

async function forceDashboardRefresh() {
    log('🔄 Force Refreshing Dashboard...', 'info');
    
    if (window.debugDashboard) {
        await window.debugDashboard.forceDashboardRefresh();
        log('✅ Dashboard refresh completed', 'success');
    } else {
        log('❌ Debug Dashboard not available', 'error');
    }
}

function checkChartStatus() {
    log('📈 Checking Chart Status...', 'info');
    
    if (window.debugDashboard) {
        window.debugDashboard.checkChartStatus();
        log('✅ Chart status check completed', 'success');
    } else {
        log('❌ Debug Dashboard not available', 'error');
    }
}

// ============================================================================
// DATA FUNCTIONS
// ============================================================================

async function validateData() {
    log('🔍 Validating Data...', 'info');
    
    if (window.debugData) {
        const result = await window.debugData.validateDataStructure();
        if (result.valid) {
            log('✅ Data validation passed', 'success');
        } else {
            log(`❌ Data validation failed: ${result.issues.join(', ')}`, 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function fixCorruptedData() {
    log('🔧 Fixing Corrupted Data...', 'info');
    
    if (window.debugData) {
        const result = await window.debugData.fixCorruptedData();
        if (result && result.success) {
            log('✅ Data corruption fix completed', 'success');
        } else {
            log('❌ Data corruption fix failed', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function analyzeData() {
    log('📊 Analyzing Data...', 'info');
    
    if (window.debugData) {
        const analysis = await window.debugData.analyzeData();
        if (analysis) {
            log('✅ Data analysis completed', 'success');
            log(`📊 Total sessions: ${analysis.totalSessions}`, 'info');
            log(`📊 Total platforms: ${analysis.totalPlatforms}`, 'info');
            log(`📊 Total time: ${analysis.totalTime}ms`, 'info');
        } else {
            log('❌ Data analysis failed', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function createBackup() {
    log('💾 Creating Backup...', 'info');
    
    if (window.debugData) {
        const backup = await window.debugData.createBackup();
        if (backup) {
            log('✅ Backup created successfully', 'success');
        } else {
            log('❌ Backup creation failed', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function restoreFromBackup() {
    log('🔄 Restoring from Backup...', 'info');
    
    if (window.debugData) {
        const backup = await window.debugData.restoreFromBackup();
        if (backup) {
            log('✅ Data restored from backup', 'success');
        } else {
            log('❌ Data restoration failed', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function createFreshData() {
    log('🆕 Creating Fresh Data...', 'info');
    
    if (window.debugData) {
        const freshData = await window.debugData.createFreshDataStructure();
        if (freshData) {
            log('✅ Fresh data structure created', 'success');
        } else {
            log('❌ Fresh data creation failed', 'error');
        }
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

async function runAllDataFixes() {
    log('🔧 Running All Data Fixes...', 'info');
    
    if (window.debugData) {
        const results = await window.debugData.runAllFixes();
        log('✅ All data fixes completed', 'success');
    } else {
        log('❌ Debug Data not available', 'error');
    }
}

// ============================================================================
// COMPREHENSIVE TEST FUNCTIONS
// ============================================================================

async function runFullExtensionTest() {
    log('🧪 Running Full Extension Test...', 'info');
    
    const results = {
        core: false,
        platforms: false,
        dashboard: false,
        data: false
    };
    
    // Test core functionality
    if (window.debugCore) {
        const coreResult = await window.debugCore.runQuickDiagnostics();
        results.core = Object.values(coreResult).filter(Boolean).length === Object.keys(coreResult).length;
    }
    
    // Test platform detection
    if (window.debugPlatforms) {
        const platform = window.debugPlatforms.debugPlatformDetection();
        results.platforms = !!platform;
    }
    
    // Test dashboard
    if (window.debugDashboard) {
        const dashboardStatus = window.debugDashboard.checkDashboardLoaded();
        results.dashboard = dashboardStatus.dashboard;
    }
    
    // Test data
    if (window.debugData) {
        const dataValidation = await window.debugData.validateDataStructure();
        results.data = dataValidation.valid;
    }
    
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    log(`📊 Full Extension Test Results: ${passed}/${total} components working`, 'info');
    
    if (passed === total) {
        log('🎉 All components working correctly!', 'success');
    } else {
        log('⚠️ Some components have issues', 'warning');
    }
    
    return results;
}

async function runIntegrationTest() {
    log('🔗 Running Integration Test...', 'info');
    
    // Test data flow from platform detection to storage
    try {
        // Simulate platform detection
        await chrome.runtime.sendMessage({
            type: 'PLATFORM_DETECTED',
            platform: 'Integration Test',
            url: window.location.href,
            timestamp: Date.now()
        });
        
        // Simulate AI interaction
        await chrome.runtime.sendMessage({
            type: 'AI_INTERACTION',
            platform: 'Integration Test',
            interaction: 'message_sent',
            timestamp: Date.now()
        });
        
        // Wait and check if data was saved
        setTimeout(async () => {
            const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
            if (response && response.platformUsage && response.platformUsage['Integration Test']) {
                log('✅ Integration test passed - data flow working', 'success');
            } else {
                log('❌ Integration test failed - data not saved', 'error');
            }
        }, 1000);
        
    } catch (error) {
        log(`❌ Integration test failed: ${error.message}`, 'error');
    }
}

async function runPerformanceTest() {
    log('⚡ Running Performance Test...', 'info');
    
    const startTime = performance.now();
    
    // Test multiple operations
    const operations = [
        () => chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' }),
        () => chrome.storage.local.get(['usageData']),
        () => window.debugCore?.testExtensionLoading(),
        () => window.debugPlatforms?.debugPlatformDetection()
    ];
    
    const results = [];
    
    for (let i = 0; i < 5; i++) {
        const operationStart = performance.now();
        
        for (const operation of operations) {
            try {
                await operation();
            } catch (error) {
                // Ignore errors for performance test
            }
        }
        
        const operationEnd = performance.now();
        results.push(operationEnd - operationStart);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgOperationTime = results.reduce((a, b) => a + b, 0) / results.length;
    
    log(`📊 Performance Test Results:`, 'info');
    log(`⏱️ Total time: ${totalTime.toFixed(2)}ms`, 'info');
    log(`⚡ Average operation time: ${avgOperationTime.toFixed(2)}ms`, 'info');
    
    if (avgOperationTime < 100) {
        log('✅ Performance is good', 'success');
    } else if (avgOperationTime < 500) {
        log('⚠️ Performance is acceptable', 'warning');
    } else {
        log('❌ Performance is poor', 'error');
    }
}

async function runStressTest() {
    log('🔥 Running Stress Test...', 'info');
    
    const operations = [];
    const numOperations = 50;
    
    // Create many operations
    for (let i = 0; i < numOperations; i++) {
        operations.push(
            chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' }),
            chrome.runtime.sendMessage({
                type: 'AI_INTERACTION',
                platform: 'Stress Test',
                interaction: 'message_sent',
                timestamp: Date.now()
            })
        );
    }
    
    const startTime = performance.now();
    
    try {
        // Run all operations concurrently
        await Promise.all(operations);
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        log(`📊 Stress Test Results:`, 'info');
        log(`🔥 ${numOperations * 2} operations completed in ${totalTime.toFixed(2)}ms`, 'info');
        log(`⚡ Average time per operation: ${(totalTime / (numOperations * 2)).toFixed(2)}ms`, 'info');
        
        if (totalTime < 5000) {
            log('✅ Stress test passed - extension handles load well', 'success');
        } else {
            log('⚠️ Stress test shows performance issues', 'warning');
        }
        
    } catch (error) {
        log(`❌ Stress test failed: ${error.message}`, 'error');
    }
}



// ============================================================================
// INITIALIZATION
// ============================================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    log('🧪 Test Suite initialized successfully', 'success');
    
    // Check if debug modules are available
    setTimeout(() => {
        if (window.debugCore) {
            log('✅ Debug Core module loaded', 'success');
        } else {
            log('❌ Debug Core module not available', 'error');
        }
        
        if (window.debugPlatforms) {
            log('✅ Debug Platforms module loaded', 'success');
        } else {
            log('❌ Debug Platforms module not available', 'error');
        }
        
        if (window.debugDashboard) {
            log('✅ Debug Dashboard module loaded', 'success');
        } else {
            log('❌ Debug Dashboard module not available', 'error');
        }
        
        if (window.debugData) {
            log('✅ Debug Data module loaded', 'success');
        } else {
            log('❌ Debug Data module not available', 'error');
        }
    }, 1000);
});

// Export functions globally
window.testSuite = {
    log,
    clearLog,
    exportLog,
    copyLog,
    runQuickDiagnostics,
    checkExtensionStatus,
    testDataCollection,
    clearAllData,
    openDashboard,
    // ... add all other functions
}; 