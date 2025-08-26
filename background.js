// AI Platform Detection Engine
const AI_PLATFORMS = {
  tier1: [
    { domain: 'chatgpt.com', name: 'ChatGPT', confidence: 'high', type: 'llm' },
    { domain: 'chat.openai.com', name: 'ChatGPT', confidence: 'high', type: 'llm' },
    { domain: 'claude.ai', name: 'Claude', confidence: 'high', type: 'llm' },
    { domain: 'gemini.google.com', name: 'Gemini', confidence: 'high', type: 'llm' },
    { domain: 'perplexity.ai', name: 'Perplexity', confidence: 'high', type: 'search' },
    { domain: 'poe.com', name: 'Poe', confidence: 'high', type: 'llm' },
    { domain: 'grok.x.ai', name: 'Grok', confidence: 'high', type: 'llm' },
    { domain: 'copilot.microsoft.com', name: 'Microsoft Copilot', confidence: 'high', type: 'llm' },
    { domain: 'bing.com', name: 'Bing Chat', confidence: 'high', type: 'search' },
    { domain: 'bard.google.com', name: 'Google Bard', confidence: 'high', type: 'llm' },
    { domain: 'you.com', name: 'You.com', confidence: 'high', type: 'search' },
    { domain: 'phind.com', name: 'Phind', confidence: 'high', type: 'search' },
    { domain: 'pi.ai', name: 'Pi', confidence: 'high', type: 'llm' },
    { domain: 'character.ai', name: 'Character.AI', confidence: 'high', type: 'llm' },
    { domain: 'huggingface.co', name: 'HuggingChat', confidence: 'high', type: 'llm' },
    { domain: 'deepai.org', name: 'DeepAI', confidence: 'high', type: 'llm' },
    { domain: 'replicate.com', name: 'Replicate', confidence: 'high', type: 'llm' },
    { domain: 'runwayml.com', name: 'Runway', confidence: 'high', type: 'creative' },
    { domain: 'midjourney.com', name: 'Midjourney', confidence: 'high', type: 'creative' },
    { domain: 'stability.ai', name: 'Stability AI', confidence: 'high', type: 'creative' },
    { domain: 'leonardo.ai', name: 'Leonardo.AI', confidence: 'high', type: 'creative' },
    { domain: 'gamma.app', name: 'Gamma', confidence: 'high', type: 'productivity' },
    { domain: 'tome.app', name: 'Tome', confidence: 'high', type: 'productivity' },
    { domain: 'beautiful.ai', name: 'Beautiful.AI', confidence: 'high', type: 'productivity' },
    { domain: 'synthesia.io', name: 'Synthesia', confidence: 'high', type: 'creative' },
    { domain: 'descript.com', name: 'Descript', confidence: 'high', type: 'creative' },
    { domain: 'elevenlabs.io', name: 'ElevenLabs', confidence: 'high', type: 'creative' },
    { domain: 'play.ht', name: 'Play.HT', confidence: 'high', type: 'creative' },
    { domain: 'jasper.ai', name: 'Jasper', confidence: 'high', type: 'writing' },
    { domain: 'copy.ai', name: 'Copy.ai', confidence: 'high', type: 'writing' },
    { domain: 'writesonic.com', name: 'Writesonic', confidence: 'high', type: 'writing' },
    { domain: 'rytr.me', name: 'Rytr', confidence: 'high', type: 'writing' },
    { domain: 'simplified.co', name: 'Simplified', confidence: 'high', type: 'writing' },
    { domain: 'surgegraph.com', name: 'SurgeGraph', confidence: 'high', type: 'seo' },
    { domain: 'surfer.com', name: 'Surfer', confidence: 'high', type: 'seo' },
    { domain: 'clearscope.io', name: 'Clearscope', confidence: 'high', type: 'seo' },
    { domain: 'ahrefs.com', name: 'Ahrefs AI', confidence: 'high', type: 'seo' },
    { domain: 'semrush.com', name: 'SEMrush AI', confidence: 'high', type: 'seo' }
  ]
};

// Usage tracking state
let activeSessions = new Map();
let usageData = {
  sessions: [],
  dailyStats: {},
  platformUsage: {},
  privacySettings: {
    workHoursOnly: false,
    workHours: { start: 9, end: 17 },
    individualOptOut: false
  }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('CliffDive AI Analytics installed');
  loadStoredData();
  checkExistingTabs();
});

// Check existing tabs when extension starts
chrome.runtime.onStartup.addListener(() => {
  console.log('CliffDive AI Analytics starting up');
  loadStoredData();
  checkExistingTabs();
});

// Check existing tabs for AI platforms
async function checkExistingTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    console.log('🔍 Checking existing tabs:', tabs.length);
    
    tabs.forEach(tab => {
      if (tab.url) {
        const platform = detectPlatform(tab.url);
        if (platform) {
          console.log('✅ Found AI platform in existing tab:', platform.name, 'in tab:', tab.id);
          startSession(tab.id, platform);
        }
      }
    });
  } catch (error) {
    console.error('Error checking existing tabs:', error);
  }
}

// Load stored data on startup
async function loadStoredData() {
  try {
    const result = await chrome.storage.local.get(['usageData', 'privacySettings']);
    
    if (result.usageData) {
      // Convert arrays back to Set objects
      const loadedData = { ...result.usageData };
      
      // Convert dailyStats arrays back to Sets
      if (loadedData.dailyStats) {
        Object.keys(loadedData.dailyStats).forEach(date => {
          const stats = loadedData.dailyStats[date];
          if (stats.platformsUsed && Array.isArray(stats.platformsUsed)) {
            stats.platformsUsed = new Set(stats.platformsUsed);
          }
          if (stats.activeUsers && Array.isArray(stats.activeUsers)) {
            stats.activeUsers = new Set(stats.activeUsers);
          }
        });
      }
      
      usageData = { ...usageData, ...loadedData };
      console.log('📂 Data loaded successfully:', usageData);
    }
    
    if (result.privacySettings) {
      usageData.privacySettings = { ...usageData.privacySettings, ...result.privacySettings };
    }
    
    // Validate data structure after loading
    validateDataStructure();
    
    // Create backup after successful load
    await createBackup();
    
  } catch (error) {
    console.error('Error loading stored data:', error);
    console.log('🔄 Attempting to restore from backup...');
    const restored = await restoreFromBackup();
    if (!restored) {
      console.log('⚠️ No backup available, starting fresh');
    }
  }
}

// Save data to storage
async function saveData() {
  try {
    // Convert Set objects to arrays for storage
    const storageData = {
      usageData: {
        ...usageData,
        dailyStats: Object.fromEntries(
          Object.entries(usageData.dailyStats).map(([date, stats]) => [
            date,
            {
              ...stats,
              platformsUsed: Array.from(stats.platformsUsed || []),
              activeUsers: Array.from(stats.activeUsers || [])
            }
          ])
        )
      },
      privacySettings: usageData.privacySettings
    };
    
    await chrome.storage.local.set(storageData);
    console.log('💾 Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Detect AI platform from URL
function detectPlatform(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  
  // Check Tier 1 platforms
  for (const platform of AI_PLATFORMS.tier1) {
    if (domain.includes(platform.domain)) {
      return { ...platform, url: url };
    }
  }
  
  return null;
}

// Check if current time is within work hours
function isWorkHours() {
  if (!usageData.privacySettings.workHoursOnly) return true;
  
  const now = new Date();
  const hour = now.getHours();
  const { start, end } = usageData.privacySettings.workHours;
  
  return hour >= start && hour <= end;
}

// Start tracking session
function startSession(tabId, platform) {
  console.log(`🔍 Attempting to start session for ${platform.name} in tab ${tabId}`);
  
  // Check if there's already an active session for this tab
  const existingSession = activeSessions.get(tabId);
  if (existingSession && existingSession.isActive) {
    console.log(`⚠️ Active session already exists for tab ${tabId}`);
    return;
  }
  
  console.log(`⚙️ Work hours only: ${usageData.privacySettings.workHoursOnly}`);
  console.log(`🕒 Current hour: ${new Date().getHours()}`);
  console.log(`⏰ Work hours: ${usageData.privacySettings.workHours.start}-${usageData.privacySettings.workHours.end}`);
  
  if (!isWorkHours()) {
    console.log(`❌ Session not started: outside work hours`);
    return;
  }
  
  const session = {
    id: `${tabId}-${Date.now()}`,
    tabId: tabId,
    platform: platform,
    startTime: Date.now(),
    lastActivity: Date.now(),
    interactions: 0,
    messagesSent: 0,
    messagesReceived: 0,
    timeSpent: 0,
    isActive: true
  };
  
  activeSessions.set(tabId, session);
  console.log(`✅ Started tracking session for ${platform.name}`);
}

// End tracking session
function endSession(tabId) {
  const session = activeSessions.get(tabId);
  if (!session) return;
  
  session.isActive = false;
  session.endTime = Date.now();
  session.timeSpent = session.endTime - session.startTime;
  
  console.log(`📊 Session ended for ${session.platform.name}:`, {
    duration: session.timeSpent,
    interactions: session.interactions,
    messages: session.messages,
    startTime: new Date(session.startTime).toISOString(),
    endTime: new Date(session.endTime).toISOString()
  });
  
  // Validate session quality
  if (isValidSession(session)) {
    usageData.sessions.push(session);
    updatePlatformUsage(session);
    updateDailyStats(session);
    saveData();
    console.log(`✅ Session saved for ${session.platform.name}`);
  } else {
    console.log(`❌ Session validation failed for ${session.platform.name}`);
  }
  
  activeSessions.delete(tabId);
  console.log(`Ended tracking session for ${session.platform.name}`);
}

// Validate session quality (anti-gaming)
function isValidSession(session) {
  const minDuration = 5 * 1000; // 5 seconds (very lenient)
  const maxDuration = 14400 * 1000; // 4 hours (very lenient)
  const minInteractions = 1;
  
  console.log(`🔍 Validating session for ${session.platform.name}:`, {
    duration: session.timeSpent,
    interactions: session.interactions,
    messages: session.messages
  });
  
  // Check duration
  if (session.timeSpent < minDuration) {
    console.log(`❌ Session validation failed: duration too short ${session.timeSpent}ms < ${minDuration}ms`);
    return false;
  }
  
  if (session.timeSpent > maxDuration) {
    console.log(`❌ Session validation failed: duration too long ${session.timeSpent}ms > ${maxDuration}ms`);
    return false;
  }
  
  // Check interactions
  if (session.interactions < minInteractions) {
    console.log(`❌ Session validation failed: too few interactions ${session.interactions} < ${minInteractions}`);
    return false;
  }
  
  // Check for realistic activity patterns (very lenient)
  if (session.interactions > 1) {
    const activityGaps = session.timeSpent / (session.interactions + 1);
    if (activityGaps < 500 || activityGaps > 1800000) { // 0.5 seconds to 30 minutes (very lenient)
      console.log(`❌ Session validation failed: unrealistic activity gaps ${activityGaps}ms`);
      return false;
    }
  }
  
  console.log(`✅ Session validation passed: duration=${session.timeSpent}ms, interactions=${session.interactions}`);
  return true;
}

// Update platform usage statistics
function updatePlatformUsage(session) {
  const platformName = session.platform.name;
  if (!usageData.platformUsage[platformName]) {
    usageData.platformUsage[platformName] = {
      totalSessions: 0,
      totalTime: 0,
      totalInteractions: 0,
      messagesSent: 0,
      messagesReceived: 0,
      lastUsed: null
    };
  }
  
  const stats = usageData.platformUsage[platformName];
  stats.totalSessions++;
  stats.totalTime += session.timeSpent;
  stats.totalInteractions += session.interactions;
  stats.messagesSent += session.messagesSent;
  stats.messagesReceived += session.messagesReceived;
  stats.lastUsed = new Date().toISOString();
}

// Update daily statistics
function updateDailyStats(session) {
  const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
  initializeDailyStats(new Date(session.startTime));
  
  const daily = usageData.dailyStats[sessionDate];
  daily.totalSessions++;
  daily.totalTime += session.timeSpent;
  daily.messagesSent += session.messagesSent;
  daily.messagesReceived += session.messagesReceived;
  daily.platformsUsed.add(session.platform.name);
}

// Initialize daily stats for a date
function initializeDailyStats(date) {
  const dateStr = date.toISOString().split('T')[0];
  if (!usageData.dailyStats[dateStr]) {
    usageData.dailyStats[dateStr] = {
      totalSessions: 0,
      totalTime: 0,
      messagesSent: 0,
      messagesReceived: 0,
      platformsUsed: new Set()
    };
  }
  // Ensure platformsUsed is always a Set
  if (!(usageData.dailyStats[dateStr].platformsUsed instanceof Set)) {
    usageData.dailyStats[dateStr].platformsUsed = new Set();
  }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const platform = detectPlatform(tab.url);
    if (platform && !activeSessions.has(tabId)) {
      startSession(tabId, platform);
    }
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  endSession(tabId);
});

// Handle tab activation (focus detection)
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Update focus for all active sessions
  activeSessions.forEach((session, tabId) => {
    if (tabId === activeInfo.tabId) {
      session.lastActivity = Date.now();
    }
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('🔍 Background script received message:', message, 'from:', sender);
  
  if (message.type === 'AI_INTERACTION') {
    console.log('🎯 Processing AI interaction:', message);
    console.log(`📊 Active sessions count: ${activeSessions.size}`);
    console.log(`🔍 Looking for session in tab: ${sender.tab.id}`);
    console.log(`🌐 Tab URL: ${sender.tab.url}`);
    
    const session = activeSessions.get(sender.tab.id);
    if (session) {
      session.interactions++;
      session.lastActivity = Date.now();
      
      if (message.subtype === 'message_sent') {
        session.messagesSent++;
        console.log(`📤 Message sent for ${session.platform.name}, total sent: ${session.messagesSent}`);
      } else if (message.subtype === 'response_received') {
        session.messagesReceived++;
        console.log(`📥 Response received for ${session.platform.name}, total received: ${session.messagesReceived}`);
      } else if (message.subtype === 'input_start') {
        console.log(`📝 Input started for ${session.platform.name}`);
      }
      
      console.log(`✅ Updated session for ${session.platform.name}:`, {
        interactions: session.interactions,
        messagesSent: session.messagesSent,
        messagesReceived: session.messagesReceived,
        timeSpent: Date.now() - session.startTime
      });
      
      // Save data more frequently during active usage
      if (session.interactions % 5 === 0) { // Save every 5 interactions
        updatePlatformUsage(session);
        updateDailyStats(session);
        saveData();
        console.log('💾 Data saved after interaction');
      }
    } else {
      console.log('⚠️ No active session found for tab:', sender.tab.id);
      console.log('📋 Available sessions:', Array.from(activeSessions.keys()));
      
      // Try to start a session if none exists
      const platform = detectPlatform(sender.tab.url);
      if (platform) {
        console.log('🔄 Attempting to start session for detected platform:', platform.name);
        startSession(sender.tab.id, platform);
        
        // Add the interaction to the newly created session
        const newSession = activeSessions.get(sender.tab.id);
        if (newSession) {
          newSession.interactions++;
          if (message.subtype === 'message_sent') {
            newSession.messages++;
          }
          console.log('✅ Added interaction to new session');
        }
      } else {
        console.log('❌ No platform detected for URL:', sender.tab.url);
      }
    }
    // Send response for AI_INTERACTION messages
    sendResponse({ success: true, sessionUpdated: !!session });
  } else if (message.type === 'GET_ANALYTICS') {
    console.log('📊 Sending analytics data');
    
    // Debug: Log session count only
    console.log('📊 Total sessions available:', usageData.sessions?.length || 0);
    
    const response = {
      platformUsage: usageData.platformUsage,
      dailyStats: usageData.dailyStats,
      sessions: usageData.sessions || [],
      activeSessions: Array.from(activeSessions.values()),
      privacySettings: usageData.privacySettings
    };
    console.log('📤 Analytics response:', response);
    sendResponse(response);
  } else if (message.type === 'PLATFORM_DETECTED') {
    console.log('🎯 Platform detected by content script:', message.platform, 'in tab:', sender.tab.id);
    // Ensure we have a session for this tab
    if (!activeSessions.has(sender.tab.id)) {
      const platform = detectPlatform(sender.tab.url);
      if (platform) {
        startSession(sender.tab.id, platform);
      }
    }
    sendResponse({ success: true });
  } else if (message.type === 'UPDATE_PRIVACY_SETTINGS') {
    console.log('⚙️ Updating privacy settings:', message.settings);
    console.log('🔍 Current privacy settings before update:', usageData.privacySettings);
    usageData.privacySettings = { ...usageData.privacySettings, ...message.settings };
    console.log('✅ Privacy settings after update:', usageData.privacySettings);
    await saveData();
    sendResponse({ success: true });
  } else if (message.type === 'FORCE_END_SESSIONS') {
    console.log('🛑 Force ending all active sessions...');
    
    const sessionCount = activeSessions.size;
    activeSessions.clear();
    console.log(`✅ Ended ${sessionCount} active sessions`);
    sendResponse({ success: true, sessionsEnded: sessionCount });
  } else if (message.type === 'CLEAR_DATA') {
    console.log('🗑️ Clearing all analytics data...');
    
    try {
      // Clear all stored data
      usageData = {
        platformUsage: {},
        dailyStats: {},
        sessions: [],
        privacySettings: {
          workHoursOnly: false,
          individualOptOut: false,
          workHours: { start: 9, end: 17 }
        }
      };
      
      // Clear active sessions
      activeSessions.clear();
      
      // Clear Chrome storage
      await chrome.storage.local.clear();
      
      // Save the empty data structure
      await saveData();
      
      console.log('✅ All data cleared successfully');
      sendResponse({ success: true });
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      sendResponse({ success: false, error: error.message });
    }
  } else {
    // Handle unknown message types
    console.log('❓ Unknown message type:', message.type);
    sendResponse({ success: false, error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open for async response
});

// Create backup of current data
async function createBackup() {
  try {
    const backup = {
      timestamp: Date.now(),
      usageData: usageData
    };
    await chrome.storage.local.set({ backup });
    console.log('💾 Backup created');
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

// Restore from backup if main data is corrupted
async function restoreFromBackup() {
  try {
    const result = await chrome.storage.local.get(['backup']);
    if (result.backup && result.backup.usageData) {
      console.log('🔄 Restoring from backup...');
      usageData = result.backup.usageData;
      validateDataStructure();
      await saveData();
      return true;
    }
  } catch (error) {
    console.error('Error restoring from backup:', error);
  }
  return false;
}

// Validate and repair data structure
function validateDataStructure() {
  // Ensure dailyStats exists and has proper structure
  if (!usageData.dailyStats) {
    usageData.dailyStats = {};
  }
  
  // Ensure platformUsage exists
  if (!usageData.platformUsage) {
    usageData.platformUsage = {};
  }
  
      // Ensure privacySettings exists (preserve existing settings)
    if (!usageData.privacySettings) {
      usageData.privacySettings = {
        workHoursOnly: false,
        workHours: { start: 9, end: 17 },
        individualOptOut: false
      };
    } else {
      // Ensure all required properties exist without overwriting existing values
      if (typeof usageData.privacySettings.workHoursOnly === 'undefined') {
        usageData.privacySettings.workHoursOnly = false;
      }
    if (!usageData.privacySettings.workHours) {
      usageData.privacySettings.workHours = { start: 9, end: 17 };
    }
    if (typeof usageData.privacySettings.individualOptOut === 'undefined') {
      usageData.privacySettings.individualOptOut = false;
    }
  }
  
  // Validate dailyStats structure
  Object.keys(usageData.dailyStats).forEach(date => {
    const stats = usageData.dailyStats[date];
    if (!stats.platformsUsed || !(stats.platformsUsed instanceof Set)) {
      stats.platformsUsed = new Set();
    }
    if (!stats.activeUsers || !(stats.activeUsers instanceof Set)) {
      stats.activeUsers = new Set();
    }
  });
  
  console.log('🔧 Data structure validated');
}

// Web request listener for network interception
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Check if this is a ChatGPT API call
    if ((details.url.includes('chatgpt.com') || details.url.includes('chat.openai.com')) && details.url.includes('/api/')) {
      console.log('🌐 ChatGPT API request detected:', details.url);
      
      // If it's a POST request, likely a message being sent
      if (details.method === 'POST') {
        console.log('📤 ChatGPT message API request detected');
        
        // Find the active session for this tab
        const session = activeSessions.get(details.tabId);
        if (session && session.platform.name === 'ChatGPT') {
          session.interactions++;
          session.messages++;
          session.lastActivity = Date.now();
          console.log(`✅ Updated ChatGPT session via network interception: ${session.messages} messages`);
          
          // Save data immediately
          updatePlatformUsage(session);
          updateDailyStats(session);
          saveData();
        }
      }
    }
  },
      { urls: ["https://chatgpt.com/*", "https://chat.openai.com/*"] },
  ["requestBody"]
);

// Periodic cleanup of stale sessions
setInterval(async () => {
  const now = Date.now();
  const maxInactiveTime = 2 * 60 * 1000; // 2 minutes (reduced from 5 minutes)
  
  // Check if tabs are still open and end sessions for closed tabs
  const tabIds = Array.from(activeSessions.keys());
  for (const tabId of tabIds) {
    try {
      const tab = await chrome.tabs.get(tabId);
      // Tab exists, check if it's inactive
      const session = activeSessions.get(tabId);
      if (session && now - session.lastActivity > maxInactiveTime) {
        console.log(`⏰ Ending inactive session for ${session.platform.name} (inactive for ${Math.round((now - session.lastActivity) / 1000)}s)`);
        endSession(tabId);
      }
    } catch (error) {
      // Tab doesn't exist (was closed), end the session
      console.log(`🗑️ Tab ${tabId} no longer exists, ending session`);
      endSession(tabId);
    }
  }
  
  // Validate data structure periodically
  validateDataStructure();
  
  // Create backup periodically
  await createBackup();
  
  // Save data periodically (but don't update timeSpent continuously)
  if (activeSessions.size > 0) {
    await saveData();
    console.log(`💾 Periodic save completed. Active sessions: ${activeSessions.size}`);
  }
}, 30000); // Check every 30 seconds 