// ============================================================================
// DEBUG DASHBOARD - Consolidated Dashboard and UI Debugging
// ============================================================================
// Combines: debug-recent-activity.js, debug-stuck-sessions.js

console.log('📊 Debug Dashboard loaded - Dashboard and UI debugging available');

// ============================================================================
// DASHBOARD DEBUGGING UTILITIES
// ============================================================================

const DebugDashboard = {
  
  // ============================================================================
  // RECENT ACTIVITY DEBUGGING
  // ============================================================================
  
  debugRecentActivity() {
    console.log('\n📋 Debugging Recent Activity Section...');
    
    // Function to check analytics data
    async function checkAnalyticsData() {
      console.log('\n📊 Checking Analytics Data...');
      
      try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
        console.log('✅ Analytics response received');
        
        if (response) {
          console.log('📈 Platform Usage:', response.platformUsage ? Object.keys(response.platformUsage) : 'None');
          console.log('📅 Daily Stats:', response.dailyStats ? Object.keys(response.dailyStats) : 'None');
          console.log('🔄 Active Sessions:', response.activeSessions ? response.activeSessions.length : 0);
          console.log('📋 Sessions Array:', response.sessions ? response.sessions.length : 0);
          
          if (response.sessions && response.sessions.length > 0) {
            console.log('📋 Recent Sessions:', response.sessions.slice(-5));
          } else {
            console.log('⚠️ No sessions data available');
          }
        } else {
          console.log('❌ No analytics response');
        }
        
        return response;
      } catch (error) {
        console.log('❌ Error getting analytics:', error.message);
        return null;
      }
    }
    
    // Function to check dashboard DOM
    function checkDashboardDOM() {
      console.log('\n🏗️ Checking Dashboard DOM...');
      
      const recentActivity = document.getElementById('recentActivity');
      const activityList = document.querySelector('.activity-list');
      const noData = document.querySelector('.no-data');
      
      console.log('📋 Recent Activity container:', !!recentActivity);
      console.log('📋 Activity list:', !!activityList);
      console.log('📋 No data message:', !!noData);
      
      if (recentActivity) {
        console.log('📋 Recent Activity HTML:', recentActivity.innerHTML.substring(0, 200) + '...');
      }
      
      return {
        recentActivity: !!recentActivity,
        activityList: !!activityList,
        noData: !!noData
      };
    }
    
    // Function to check dashboard JavaScript
    function checkDashboardJS() {
      console.log('\n⚙️ Checking Dashboard JavaScript...');
      
      const dashboard = window.dashboard;
      const updateRecentActivity = dashboard ? dashboard.updateRecentActivity : null;
      
      console.log('📊 Dashboard object:', !!dashboard);
      console.log('📊 Update Recent Activity function:', !!updateRecentActivity);
      
      if (dashboard) {
        console.log('📊 Dashboard analytics data:', !!dashboard.analyticsData);
        console.log('📊 Dashboard current section:', dashboard.currentSection);
      }
      
      return {
        dashboard: !!dashboard,
        updateRecentActivity: !!updateRecentActivity,
        analyticsData: dashboard ? !!dashboard.analyticsData : false
      };
    }
    
    // Function to manually trigger recent activity update
    async function manuallyUpdateRecentActivity() {
      console.log('\n🔄 Manually Triggering Recent Activity Update...');
      
      const dashboard = window.dashboard;
      if (dashboard && dashboard.updateRecentActivity) {
        try {
          await dashboard.updateRecentActivity();
          console.log('✅ Recent activity update triggered');
        } catch (error) {
          console.log('❌ Error updating recent activity:', error.message);
        }
      } else {
        console.log('❌ Dashboard or update function not available');
      }
    }
    
    // Function to check for recent sessions
    function checkRecentSessions(analyticsData) {
      console.log('\n📋 Checking Recent Sessions...');
      
      if (!analyticsData || !analyticsData.sessions) {
        console.log('❌ No sessions data available');
        return [];
      }
      
      const sessions = analyticsData.sessions;
      const recentSessions = sessions.slice(-10).reverse(); // Last 10 sessions
      
      console.log(`📋 Total sessions: ${sessions.length}`);
      console.log(`📋 Recent sessions (last 10): ${recentSessions.length}`);
      
      if (recentSessions.length > 0) {
        console.log('📋 Recent session details:');
        recentSessions.forEach((session, index) => {
          console.log(`  ${index + 1}. ${session.platform.name} - ${session.timeSpent}ms - ${session.interactions} interactions`);
        });
      }
      
      return recentSessions;
    }
    
    // Function to simulate session creation
    async function simulateSessionCreation() {
      console.log('\n🎮 Simulating Session Creation...');
      
      try {
        // Simulate platform detection
        await chrome.runtime.sendMessage({
          type: 'PLATFORM_DETECTED',
          platform: 'Test Platform',
          url: window.location.href,
          timestamp: Date.now()
        });
        console.log('✅ Platform detection simulated');
        
        // Simulate AI interaction
        await chrome.runtime.sendMessage({
          type: 'AI_INTERACTION',
          platform: 'Test Platform',
          interaction: 'message_sent',
          timestamp: Date.now()
        });
        console.log('✅ AI interaction simulated');
        
        // Wait a moment and check for new session
        setTimeout(async () => {
          const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
          if (response && response.sessions) {
            console.log('📋 Sessions after simulation:', response.sessions.length);
          }
        }, 1000);
        
      } catch (error) {
        console.log('❌ Error simulating session:', error.message);
      }
    }
    
    // Function to check storage directly
    async function checkStorageDirectly() {
      console.log('\n💾 Checking Storage Directly...');
      
      try {
        const result = await chrome.storage.local.get(['usageData']);
        console.log('✅ Storage access successful');
        
        if (result.usageData) {
          console.log('📊 Usage data found in storage');
          console.log('📋 Sessions in storage:', result.usageData.sessions ? result.usageData.sessions.length : 0);
          console.log('📈 Platform usage in storage:', result.usageData.platformUsage ? Object.keys(result.usageData.platformUsage) : 'None');
        } else {
          console.log('❌ No usage data in storage');
        }
        
        return result.usageData;
      } catch (error) {
        console.log('❌ Error accessing storage:', error.message);
        return null;
      }
    }
    
    // Main diagnostic function
    async function runRecentActivityDiagnostics() {
      console.log('\n🔍 Running Recent Activity Diagnostics...');
      
      const results = {
        analyticsData: null,
        dom: null,
        js: null,
        storage: null,
        recentSessions: []
      };
      
      // Check analytics data
      results.analyticsData = await checkAnalyticsData();
      
      // Check DOM
      results.dom = checkDashboardDOM();
      
      // Check JavaScript
      results.js = checkDashboardJS();
      
      // Check storage
      results.storage = await checkStorageDirectly();
      
      // Check recent sessions
      if (results.analyticsData) {
        results.recentSessions = checkRecentSessions(results.analyticsData);
      }
      
      // Provide recommendations
      console.log('\n💡 Recommendations:');
      
      if (!results.analyticsData) {
        console.log('❌ No analytics data - Check if background script is working');
      }
      
      if (!results.dom.recentActivity) {
        console.log('❌ Recent activity container not found - Check dashboard HTML');
      }
      
      if (!results.js.dashboard) {
        console.log('❌ Dashboard object not found - Check if dashboard.js is loaded');
      }
      
      if (!results.storage) {
        console.log('❌ No storage data - Check if data is being saved');
      }
      
      if (results.recentSessions.length === 0) {
        console.log('❌ No recent sessions - Try creating some sessions first');
      }
      
      console.log('\n📊 Recent Activity Diagnostics Complete');
      return results;
    }
    
    // Run diagnostics
    return runRecentActivityDiagnostics();
  },
  
  // ============================================================================
  // STUCK SESSIONS DEBUGGING
  // ============================================================================
  
  debugStuckSessions() {
    console.log('\n🔍 Debugging Stuck Sessions...');
    
    // Function to check current active sessions
    async function checkActiveSessions() {
      console.log('\n🔄 Checking Active Sessions...');
      
      try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
        
        if (response && response.activeSessions) {
          console.log(`📊 Active sessions: ${response.activeSessions.length}`);
          
          response.activeSessions.forEach((session, index) => {
            const duration = Math.round((Date.now() - session.startTime) / 1000);
            const lastActivity = Math.round((Date.now() - session.lastActivity) / 1000);
            
            console.log(`  ${index + 1}. ${session.platform.name}`);
            console.log(`     Duration: ${duration}s`);
            console.log(`     Last activity: ${lastActivity}s ago`);
            console.log(`     Interactions: ${session.interactions}`);
            console.log(`     Messages: ${session.messages}`);
            console.log(`     Tab ID: ${session.tabId}`);
          });
          
          return response.activeSessions;
        } else {
          console.log('❌ No active sessions data');
          return [];
        }
      } catch (error) {
        console.log('❌ Error checking active sessions:', error.message);
        return [];
      }
    }
    
    // Function to check platform usage for suspicious data
    function checkPlatformUsage(analyticsData) {
      console.log('\n📈 Checking Platform Usage for Suspicious Data...');
      
      if (!analyticsData || !analyticsData.platformUsage) {
        console.log('❌ No platform usage data');
        return;
      }
      
      const platforms = analyticsData.platformUsage;
      const suspicious = [];
      
      Object.entries(platforms).forEach(([name, stats]) => {
        const avgSessionTime = stats.totalSessions > 0 ? stats.totalTime / stats.totalSessions / (1000 * 60) : 0;
        const avgMessages = stats.totalSessions > 0 ? stats.totalMessages / stats.totalSessions : 0;
        
        // Check for suspicious patterns
        if (stats.totalSessions > 0 && stats.totalMessages === 0) {
          suspicious.push(`${name}: Sessions but no messages`);
        }
        
        if (avgSessionTime > 60) { // More than 1 hour average
          suspicious.push(`${name}: Very long avg session (${Math.round(avgSessionTime)}m)`);
        }
        
        if (avgMessages > 50) { // More than 50 messages per session
          suspicious.push(`${name}: Very high message count (${Math.round(avgMessages)}/session)`);
        }
      });
      
      if (suspicious.length > 0) {
        console.log('⚠️ Suspicious data patterns found:');
        suspicious.forEach(item => console.log(`  - ${item}`));
      } else {
        console.log('✅ No suspicious data patterns found');
      }
      
      return suspicious;
    }
    
    // Function to force end all active sessions
    async function forceEndAllSessions() {
      console.log('\n🛑 Force Ending All Active Sessions...');
      
      try {
        const response = await chrome.runtime.sendMessage({ type: 'FORCE_END_SESSIONS' });
        
        if (response && response.success) {
          console.log(`✅ Force ended ${response.sessionsEnded} active sessions`);
        } else {
          console.log('❌ Failed to force end sessions');
        }
        
        return response;
      } catch (error) {
        console.log('❌ Error force ending sessions:', error.message);
        return null;
      }
    }
    
    // Function to clear all data
    async function clearAllData() {
      console.log('\n🗑️ Clearing All Data...');
      
      try {
        const response = await chrome.runtime.sendMessage({ type: 'CLEAR_ALL_DATA' });
        
        if (response && response.success) {
          console.log('✅ All data cleared successfully');
        } else {
          console.log('❌ Failed to clear data');
        }
        
        return response;
      } catch (error) {
        console.log('❌ Error clearing data:', error.message);
        return null;
      }
    }
    
    // Function to check storage directly
    async function checkStorageDirectly() {
      console.log('\n💾 Checking Storage Directly...');
      
      try {
        const result = await chrome.storage.local.get(['usageData']);
        
        if (result.usageData) {
          console.log('📊 Usage data found in storage');
          console.log('📋 Sessions:', result.usageData.sessions ? result.usageData.sessions.length : 0);
          console.log('📈 Platform usage:', result.usageData.platformUsage ? Object.keys(result.usageData.platformUsage) : 'None');
          
          // Check for stuck sessions in storage
          if (result.usageData.sessions) {
            const recentSessions = result.usageData.sessions.slice(-5);
            console.log('📋 Recent sessions in storage:');
            recentSessions.forEach((session, index) => {
              const duration = Math.round((Date.now() - session.startTime) / 1000);
              console.log(`  ${index + 1}. ${session.platform.name} - ${duration}s ago`);
            });
          }
        } else {
          console.log('❌ No usage data in storage');
        }
        
        return result.usageData;
      } catch (error) {
        console.log('❌ Error accessing storage:', error.message);
        return null;
      }
    }
    
    // Function to simulate session cleanup
    async function simulateSessionCleanup() {
      console.log('\n🧹 Simulating Session Cleanup...');
      
      try {
        // Get current sessions
        const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
        
        if (response && response.activeSessions) {
          console.log(`📊 Current active sessions: ${response.activeSessions.length}`);
          
          // Simulate cleanup by ending sessions
          if (response.activeSessions.length > 0) {
            console.log('🛑 Ending all active sessions...');
            await forceEndAllSessions();
            
            // Check again
            setTimeout(async () => {
              const newResponse = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
              console.log(`📊 Active sessions after cleanup: ${newResponse.activeSessions ? newResponse.activeSessions.length : 0}`);
            }, 1000);
          }
        }
      } catch (error) {
        console.log('❌ Error simulating cleanup:', error.message);
      }
    }
    
    // Main diagnostic function
    async function runStuckSessionDiagnostics() {
      console.log('\n🔍 Running Stuck Session Diagnostics...');
      
      const results = {
        activeSessions: [],
        suspiciousData: [],
        storage: null,
        cleanupResult: null
      };
      
      // Check active sessions
      results.activeSessions = await checkActiveSessions();
      
      // Check for suspicious data
      const analyticsResponse = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      if (analyticsResponse) {
        results.suspiciousData = checkPlatformUsage(analyticsResponse);
      }
      
      // Check storage
      results.storage = await checkStorageDirectly();
      
      // Provide recommendations
      console.log('\n💡 Recommendations:');
      
      if (results.activeSessions.length > 0) {
        console.log(`⚠️ ${results.activeSessions.length} active sessions found`);
        console.log('💡 Consider force ending sessions if they appear stuck');
      }
      
      if (results.suspiciousData && results.suspiciousData.length > 0) {
        console.log('⚠️ Suspicious data patterns detected');
        console.log('💡 Consider clearing data and starting fresh');
      }
      
      if (!results.storage) {
        console.log('❌ No storage data found');
        console.log('💡 Check if data is being saved properly');
      }
      
      console.log('\n📊 Stuck Session Diagnostics Complete');
      return results;
    }
    
    // Run diagnostics
    return runStuckSessionDiagnostics();
  },
  
  // ============================================================================
  // DASHBOARD UTILITIES
  // ============================================================================
  
  // Check if dashboard is loaded
  checkDashboardLoaded() {
    console.log('\n📊 Checking Dashboard Load Status...');
    
    const dashboard = window.dashboard;
    const dashboardContainer = document.querySelector('.dashboard-container');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    console.log('📊 Dashboard object:', !!dashboard);
    console.log('📊 Dashboard container:', !!dashboardContainer);
    console.log('📊 Sidebar:', !!sidebar);
    console.log('📊 Main content:', !!mainContent);
    
    if (dashboard) {
      console.log('📊 Current section:', dashboard.currentSection);
      console.log('📊 Analytics data:', !!dashboard.analyticsData);
      console.log('📊 Charts loaded:', !!dashboard.charts);
    }
    
    return {
      dashboard: !!dashboard,
      container: !!dashboardContainer,
      sidebar: !!sidebar,
      mainContent: !!mainContent
    };
  },
  
  // Force dashboard refresh
  async forceDashboardRefresh() {
    console.log('\n🔄 Force Refreshing Dashboard...');
    
    const dashboard = window.dashboard;
    if (dashboard && dashboard.loadAnalytics) {
      try {
        await dashboard.loadAnalytics();
        console.log('✅ Dashboard refresh completed');
      } catch (error) {
        console.log('❌ Error refreshing dashboard:', error.message);
      }
    } else {
      console.log('❌ Dashboard not available');
    }
  },
  
  // Check chart status
  checkChartStatus() {
    console.log('\n📈 Checking Chart Status...');
    
    const dashboard = window.dashboard;
    if (!dashboard || !dashboard.charts) {
      console.log('❌ No charts available');
      return;
    }
    
    const charts = dashboard.charts;
    console.log('📈 Charts loaded:', Object.keys(charts));
    
    Object.entries(charts).forEach(([name, chart]) => {
      console.log(`📈 ${name}:`, !!chart);
    });
  },
  
  // ============================================================================
  // EXPORT FUNCTIONS
  // ============================================================================
  
  // Make functions available globally
  exportToWindow() {
    window.debugDashboard = this;
    console.log('📊 Debug Dashboard functions exported to window.debugDashboard');
  }
};

// Auto-export to window
DebugDashboard.exportToWindow();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugDashboard;
} 