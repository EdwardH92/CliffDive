// ============================================================================
// DEBUG DATA - Consolidated Data Storage and Analytics Debugging
// ============================================================================
// Combines: fix-corrupted-data.js

console.log('💾 Debug Data loaded - Data storage and analytics debugging available');

// ============================================================================
// DATA DEBUGGING UTILITIES
// ============================================================================

const DebugData = {
  
  // ============================================================================
  // DATA CORRUPTION FIXES
  // ============================================================================
  
  async fixCorruptedData() {
    console.log('\n🔧 Starting Data Corruption Fix...');
    
    try {
      // Get current data
      const result = await chrome.storage.local.get(['usageData']);
      const currentData = result.usageData;
      
      console.log('📊 Current data structure:', currentData ? 'Found' : 'Not found');
      
      if (!currentData) {
        console.log('❌ No data found - creating fresh data structure');
        await this.createFreshDataStructure();
        return;
      }
      
      // Check for corruption indicators
      const corruptionIssues = this.detectCorruption(currentData);
      
      if (corruptionIssues.length === 0) {
        console.log('✅ No corruption detected');
        return { success: true, issues: [] };
      }
      
      console.log('⚠️ Corruption issues detected:', corruptionIssues);
      
      // Fix corruption issues
      const fixedData = await this.applyCorruptionFixes(currentData, corruptionIssues);
      
      // Save fixed data
      await chrome.storage.local.set({ usageData: fixedData });
      console.log('✅ Fixed data saved');
      
      return { success: true, issues: corruptionIssues, fixed: true };
      
    } catch (error) {
      console.log('❌ Error fixing corrupted data:', error.message);
      return { success: false, error: error.message };
    }
  },
  
  detectCorruption(data) {
    const issues = [];
    
    // Check for missing required properties
    const requiredProperties = ['platformUsage', 'dailyStats', 'sessions', 'privacySettings'];
    requiredProperties.forEach(prop => {
      if (!data.hasOwnProperty(prop)) {
        issues.push(`Missing required property: ${prop}`);
      }
    });
    
    // Check for invalid data types
    if (data.platformUsage && typeof data.platformUsage !== 'object') {
      issues.push('platformUsage is not an object');
    }
    
    if (data.dailyStats && typeof data.dailyStats !== 'object') {
      issues.push('dailyStats is not an object');
    }
    
    if (data.sessions && !Array.isArray(data.sessions)) {
      issues.push('sessions is not an array');
    }
    
    // Check for invalid session data
    if (data.sessions && Array.isArray(data.sessions)) {
      data.sessions.forEach((session, index) => {
        if (!session.platform || !session.platform.name) {
          issues.push(`Session ${index} missing platform information`);
        }
        if (typeof session.timeSpent !== 'number') {
          issues.push(`Session ${index} has invalid timeSpent`);
        }
      });
    }
    
    // Check for invalid platform usage data
    if (data.platformUsage && typeof data.platformUsage === 'object') {
      Object.entries(data.platformUsage).forEach(([platform, stats]) => {
        if (typeof stats.totalSessions !== 'number') {
          issues.push(`${platform}: totalSessions is not a number`);
        }
        if (typeof stats.totalTime !== 'number') {
          issues.push(`${platform}: totalTime is not a number`);
        }
        if (typeof stats.totalMessages !== 'number') {
          issues.push(`${platform}: totalMessages is not a number`);
        }
      });
    }
    
    return issues;
  },
  
  async applyCorruptionFixes(data, issues) {
    console.log('🔧 Applying corruption fixes...');
    
    let fixedData = { ...data };
    
    // Fix missing properties
    if (!fixedData.platformUsage) {
      fixedData.platformUsage = {};
      console.log('✅ Added missing platformUsage');
    }
    
    if (!fixedData.dailyStats) {
      fixedData.dailyStats = {};
      console.log('✅ Added missing dailyStats');
    }
    
    if (!fixedData.sessions) {
      fixedData.sessions = [];
      console.log('✅ Added missing sessions');
    }
    
    if (!fixedData.privacySettings) {
      fixedData.privacySettings = {
        workHoursOnly: false,
        workHours: { start: 9, end: 17 },
        individualOptOut: false
      };
      console.log('✅ Added missing privacySettings');
    }
    
    // Fix invalid data types
    if (typeof fixedData.platformUsage !== 'object') {
      fixedData.platformUsage = {};
      console.log('✅ Fixed platformUsage type');
    }
    
    if (typeof fixedData.dailyStats !== 'object') {
      fixedData.dailyStats = {};
      console.log('✅ Fixed dailyStats type');
    }
    
    if (!Array.isArray(fixedData.sessions)) {
      fixedData.sessions = [];
      console.log('✅ Fixed sessions type');
    }
    
    // Fix invalid session data
    if (Array.isArray(fixedData.sessions)) {
      fixedData.sessions = fixedData.sessions.filter(session => {
        if (!session || typeof session !== 'object') {
          console.log('✅ Removed invalid session');
          return false;
        }
        
        // Fix missing platform info
        if (!session.platform || !session.platform.name) {
          session.platform = { name: 'Unknown', tier: 1, type: 'unknown' };
          console.log('✅ Fixed session platform info');
        }
        
        // Fix invalid timeSpent
        if (typeof session.timeSpent !== 'number' || session.timeSpent < 0) {
          session.timeSpent = 0;
          console.log('✅ Fixed session timeSpent');
        }
        
        // Fix invalid interactions
        if (typeof session.interactions !== 'number' || session.interactions < 0) {
          session.interactions = 0;
          console.log('✅ Fixed session interactions');
        }
        
        // Fix invalid messages
        if (typeof session.messages !== 'number' || session.messages < 0) {
          session.messages = 0;
          console.log('✅ Fixed session messages');
        }
        
        return true;
      });
    }
    
    // Fix invalid platform usage data
    if (typeof fixedData.platformUsage === 'object') {
      Object.keys(fixedData.platformUsage).forEach(platform => {
        const stats = fixedData.platformUsage[platform];
        
        if (typeof stats.totalSessions !== 'number' || stats.totalSessions < 0) {
          stats.totalSessions = 0;
          console.log(`✅ Fixed ${platform} totalSessions`);
        }
        
        if (typeof stats.totalTime !== 'number' || stats.totalTime < 0) {
          stats.totalTime = 0;
          console.log(`✅ Fixed ${platform} totalTime`);
        }
        
        if (typeof stats.totalMessages !== 'number' || stats.totalMessages < 0) {
          stats.totalMessages = 0;
          console.log(`✅ Fixed ${platform} totalMessages`);
        }
        
        if (typeof stats.lastUsed !== 'number') {
          stats.lastUsed = Date.now();
          console.log(`✅ Fixed ${platform} lastUsed`);
        }
      });
    }
    
    return fixedData;
  },
  
  async createFreshDataStructure() {
    console.log('🆕 Creating fresh data structure...');
    
    const freshData = {
      platformUsage: {},
      dailyStats: {},
      sessions: [],
      privacySettings: {
        workHoursOnly: false,
        workHours: { start: 9, end: 17 },
        individualOptOut: false
      }
    };
    
    await chrome.storage.local.set({ usageData: freshData });
    console.log('✅ Fresh data structure created');
    
    return freshData;
  },
  
  async clearCorruptedData() {
    console.log('🗑️ Clearing corrupted data...');
    
    try {
      await chrome.storage.local.remove(['usageData']);
      console.log('✅ Corrupted data cleared');
      
      // Create fresh data structure
      await this.createFreshDataStructure();
      
      return { success: true };
    } catch (error) {
      console.log('❌ Error clearing data:', error.message);
      return { success: false, error: error.message };
    }
  },
  
  // ============================================================================
  // DATA VALIDATION
  // ============================================================================
  
  async validateDataStructure() {
    console.log('\n🔍 Validating Data Structure...');
    
    try {
      const result = await chrome.storage.local.get(['usageData']);
      const data = result.usageData;
      
      if (!data) {
        console.log('❌ No data found');
        return { valid: false, issues: ['No data found'] };
      }
      
      const issues = this.detectCorruption(data);
      
      if (issues.length === 0) {
        console.log('✅ Data structure is valid');
        return { valid: true, issues: [] };
      } else {
        console.log('⚠️ Data structure has issues:', issues);
        return { valid: false, issues };
      }
      
    } catch (error) {
      console.log('❌ Error validating data:', error.message);
      return { valid: false, issues: [error.message] };
    }
  },
  
  async testDataCollection() {
    console.log('\n🧪 Testing Data Collection...');
    
    try {
      // Test platform detection
      await chrome.runtime.sendMessage({
        type: 'PLATFORM_DETECTED',
        platform: 'Test Platform',
        url: window.location.href,
        timestamp: Date.now()
      });
      console.log('✅ Platform detection test passed');
      
      // Test AI interaction
      await chrome.runtime.sendMessage({
        type: 'AI_INTERACTION',
        platform: 'Test Platform',
        interaction: 'message_sent',
        timestamp: Date.now()
      });
      console.log('✅ AI interaction test passed');
      
      // Wait a moment and check if data was saved
      setTimeout(async () => {
        const result = await chrome.storage.local.get(['usageData']);
        if (result.usageData) {
          console.log('✅ Data collection test passed');
          console.log('📊 Test platform data:', result.usageData.platformUsage['Test Platform']);
        } else {
          console.log('❌ Data collection test failed');
        }
      }, 1000);
      
      return { success: true };
      
    } catch (error) {
      console.log('❌ Data collection test failed:', error.message);
      return { success: false, error: error.message };
    }
  },
  
  // ============================================================================
  // DATA ANALYSIS
  // ============================================================================
  
  async analyzeData() {
    console.log('\n📊 Analyzing Data...');
    
    try {
      const result = await chrome.storage.local.get(['usageData']);
      const data = result.usageData;
      
      if (!data) {
        console.log('❌ No data to analyze');
        return null;
      }
      
      const analysis = {
        totalSessions: data.sessions ? data.sessions.length : 0,
        totalPlatforms: data.platformUsage ? Object.keys(data.platformUsage).length : 0,
        totalTime: 0,
        totalMessages: 0,
        platforms: [],
        recentActivity: [],
        dataSize: JSON.stringify(data).length
      };
      
      // Calculate totals
      if (data.platformUsage) {
        Object.entries(data.platformUsage).forEach(([platform, stats]) => {
          analysis.totalTime += stats.totalTime || 0;
          analysis.totalMessages += stats.totalMessages || 0;
          analysis.platforms.push({
            name: platform,
            sessions: stats.totalSessions || 0,
            time: stats.totalTime || 0,
            messages: stats.totalMessages || 0,
            lastUsed: stats.lastUsed || 0
          });
        });
      }
      
      // Get recent activity
      if (data.sessions && data.sessions.length > 0) {
        analysis.recentActivity = data.sessions
          .slice(-10)
          .reverse()
          .map(session => ({
            platform: session.platform.name,
            timeSpent: session.timeSpent,
            interactions: session.interactions,
            messages: session.messages,
            startTime: session.startTime
          }));
      }
      
      console.log('📊 Data Analysis Results:', analysis);
      return analysis;
      
    } catch (error) {
      console.log('❌ Error analyzing data:', error.message);
      return null;
    }
  },
  
  // ============================================================================
  // DATA BACKUP AND RESTORE
  // ============================================================================
  
  async createBackup() {
    console.log('\n💾 Creating Data Backup...');
    
    try {
      const result = await chrome.storage.local.get(['usageData']);
      const data = result.usageData;
      
      if (!data) {
        console.log('❌ No data to backup');
        return null;
      }
      
      const backup = {
        timestamp: Date.now(),
        data: data,
        version: '1.0'
      };
      
      // Store backup in storage
      await chrome.storage.local.set({ dataBackup: backup });
      console.log('✅ Backup created successfully');
      
      return backup;
      
    } catch (error) {
      console.log('❌ Error creating backup:', error.message);
      return null;
    }
  },
  
  async restoreFromBackup() {
    console.log('\n🔄 Restoring from Backup...');
    
    try {
      const result = await chrome.storage.local.get(['dataBackup']);
      const backup = result.dataBackup;
      
      if (!backup) {
        console.log('❌ No backup found');
        return null;
      }
      
      // Restore data
      await chrome.storage.local.set({ usageData: backup.data });
      console.log('✅ Data restored from backup');
      
      return backup;
      
    } catch (error) {
      console.log('❌ Error restoring from backup:', error.message);
      return null;
    }
  },
  
  // ============================================================================
  // COMPREHENSIVE DATA DIAGNOSTICS
  // ============================================================================
  
  async runAllFixes() {
    console.log('\n🔧 Running All Data Fixes...');
    
    const results = {
      validation: null,
      corruption: null,
      backup: null,
      test: null
    };
    
    // Step 1: Validate current data
    results.validation = await this.validateDataStructure();
    
    // Step 2: Fix corruption if needed
    if (!results.validation.valid) {
      results.corruption = await this.fixCorruptedData();
    }
    
    // Step 3: Create backup
    results.backup = await this.createBackup();
    
    // Step 4: Test data collection
    results.test = await this.testDataCollection();
    
    console.log('\n📊 All Fixes Results:', results);
    
    // Provide recommendations
    console.log('\n💡 Recommendations:');
    
    if (!results.validation.valid) {
      console.log('⚠️ Data structure was corrupted - fixes applied');
    }
    
    if (results.backup) {
      console.log('✅ Backup created successfully');
    }
    
    if (results.test && results.test.success) {
      console.log('✅ Data collection working properly');
    } else {
      console.log('❌ Data collection may have issues');
    }
    
    return results;
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
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },
  
  // ============================================================================
  // EXPORT FUNCTIONS
  // ============================================================================
  
  // Make functions available globally
  exportToWindow() {
    window.debugData = this;
    console.log('💾 Debug Data functions exported to window.debugData');
  }
};

// Auto-export to window
DebugData.exportToWindow();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugData;
} 