// ============================================================================
// DEBUG PLATFORMS - Consolidated Platform-Specific Debugging
// ============================================================================
// Combines: debug-chatgpt.js, debug-chatgpt-comprehensive.js, 
// debug-gemini-messages.js, platform-debug.js, force-chatgpt-tracking.js

console.log('🎯 Debug Platforms loaded - Platform-specific debugging available');

// ============================================================================
// PLATFORM DEBUGGING UTILITIES
// ============================================================================

const DebugPlatforms = {
  
  // ============================================================================
  // CHATGPT DEBUGGING
  // ============================================================================
  
  debugChatGPT() {
    console.log('\n🤖 Starting ChatGPT Debugging...');
    
    const hostname = window.location.hostname;
    if (!hostname.includes('chatgpt.com') && !hostname.includes('chat.openai.com')) {
      console.log('❌ Not on ChatGPT - current hostname:', hostname);
      return false;
    }
    
    console.log('✅ On ChatGPT platform');
    
    // Test 1: Check for key ChatGPT elements
    const textarea = document.querySelector('textarea');
    const chatContainer = document.querySelector('[role="list"]') || 
                         document.querySelector('[data-testid="conversation-turn"]') ||
                         document.querySelector('main');
    const sendButton = document.querySelector('button[data-testid="send-button"]') ||
                      document.querySelector('button[aria-label*="Send"]') ||
                      document.querySelector('button[type="submit"]');
    
    console.log('📝 Textarea found:', !!textarea);
    console.log('💬 Chat container found:', !!chatContainer);
    console.log('📤 Send button found:', !!sendButton);
    
    if (textarea) {
      console.log('📝 Textarea details:', {
        placeholder: textarea.placeholder,
        'data-testid': textarea.getAttribute('data-testid'),
        className: textarea.className,
        value: textarea.value
      });
    }
    
    // Test 2: Check for conversation elements
    const conversationTurns = document.querySelectorAll('[data-testid="conversation-turn"]');
    const listItems = document.querySelectorAll('[role="listitem"]');
    const userMessages = document.querySelectorAll('[aria-label="User"]');
    const assistantMessages = document.querySelectorAll('[aria-label="Assistant"]');
    
    console.log('🔄 Conversation turns:', conversationTurns.length);
    console.log('📋 List items:', listItems.length);
    console.log('👤 User messages:', userMessages.length);
    console.log('🤖 Assistant messages:', assistantMessages.length);
    
    // Test 3: Check for analytics object
    if (window.cliffDiveAnalytics) {
      console.log('✅ Analytics object found');
      console.log('   Platform:', window.cliffDiveAnalytics.platform);
      console.log('   Detector:', window.cliffDiveAnalytics);
    } else {
      console.log('❌ Analytics object not found');
    }
    
    // Test 4: Test communication
    this.testChatGPTCommunication();
    
    return true;
  },
  
  async testChatGPTCommunication() {
    console.log('\n📡 Testing ChatGPT Communication...');
    
    try {
      // Test platform detection
      const platformResponse = await chrome.runtime.sendMessage({
        type: 'PLATFORM_DETECTED',
        platform: 'ChatGPT',
        url: window.location.href,
        timestamp: Date.now()
      });
      console.log('✅ Platform detection sent successfully');
      
      // Test analytics retrieval
      const analyticsResponse = await chrome.runtime.sendMessage({ 
        type: 'GET_ANALYTICS' 
      });
      console.log('✅ Analytics retrieved successfully');
      
      if (analyticsResponse && analyticsResponse.platformUsage) {
        const chatGPTData = analyticsResponse.platformUsage['ChatGPT'];
        if (chatGPTData) {
          console.log('📊 ChatGPT usage data:', {
            sessions: chatGPTData.totalSessions,
            time: chatGPTData.totalTime,
            messages: chatGPTData.totalMessages,
            lastUsed: chatGPTData.lastUsed
          });
        } else {
          console.log('⚠️ No ChatGPT usage data found');
        }
      }
      
    } catch (error) {
      console.log('❌ Communication failed:', error.message);
    }
  },
  
  // ============================================================================
  // COMPREHENSIVE CHATGPT DEBUGGING
  // ============================================================================
  
  debugChatGPTComprehensive() {
    console.log('\n🔍 Starting Comprehensive ChatGPT Debugging...');
    
    const results = {
      platformDetection: this.testChatGPTPlatformDetection(),
      domElements: this.testChatGPTDOMElements(),
      analyticsObject: this.testChatGPTAnalyticsObject(),
      communication: false,
      interactionSimulation: this.testChatGPTInteractionSimulation(),
      realTimeMonitoring: this.testChatGPTRealTimeMonitoring()
    };
    
    // Test communication asynchronously
    this.testChatGPTCommunication().then(() => {
      results.communication = true;
      console.log('\n📊 Comprehensive ChatGPT Debug Results:', results);
    });
    
    return results;
  },
  
  testChatGPTPlatformDetection() {
    console.log('\n🎯 Testing ChatGPT Platform Detection...');
    
    const hostname = window.location.hostname;
    const url = window.location.href;
    
    const isChatGPT = hostname.includes('chatgpt.com') || 
                     hostname.includes('chat.openai.com') ||
                     url.includes('chatgpt.com') ||
                     url.includes('chat.openai.com');
    
    if (isChatGPT) {
      console.log('✅ Confirmed on ChatGPT page');
      return true;
    } else {
      console.log('❌ Not on ChatGPT page');
      return false;
    }
  },
  
  testChatGPTDOMElements() {
    console.log('\n🏗️ Testing ChatGPT DOM Elements...');
    
    const elements = {
      textarea: document.querySelector('textarea'),
      main: document.querySelector('main'),
      chatContainer: document.querySelector('[role="list"]') || 
                    document.querySelector('[data-testid="conversation-turn"]'),
      sendButton: document.querySelector('button[data-testid="send-button"]') ||
                 document.querySelector('button[aria-label*="Send"]'),
      conversationTurns: document.querySelectorAll('[data-testid="conversation-turn"]'),
      listItems: document.querySelectorAll('[role="listitem"]'),
      userMessages: document.querySelectorAll('[aria-label="User"]'),
      assistantMessages: document.querySelectorAll('[aria-label="Assistant"]')
    };
    
    console.log('📝 Textarea:', !!elements.textarea);
    console.log('🏠 Main:', !!elements.main);
    console.log('💬 Chat container:', !!elements.chatContainer);
    console.log('📤 Send button:', !!elements.sendButton);
    console.log('🔄 Conversation turns:', elements.conversationTurns.length);
    console.log('📋 List items:', elements.listItems.length);
    console.log('👤 User messages:', elements.userMessages.length);
    console.log('🤖 Assistant messages:', elements.assistantMessages.length);
    
    return elements;
  },
  
  testChatGPTAnalyticsObject() {
    console.log('\n📊 Testing ChatGPT Analytics Object...');
    
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
  
  testChatGPTInteractionSimulation() {
    console.log('\n🎮 Testing ChatGPT Interaction Simulation...');
    
    const textarea = document.querySelector('textarea');
    if (!textarea) {
      console.log('❌ No textarea found for simulation');
      return false;
    }
    
    // Simulate typing
    textarea.value = 'Test message for debugging';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Typing simulation completed');
    
    // Simulate focus
    textarea.focus();
    console.log('✅ Focus simulation completed');
    
    return true;
  },
  
  testChatGPTRealTimeMonitoring() {
    console.log('\n👀 Testing ChatGPT Real-Time Monitoring...');
    
    // Monitor for new messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const newMessages = mutation.addedNodes;
          newMessages.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.getAttribute && node.getAttribute('aria-label')) {
                console.log('🆕 New message detected:', node.getAttribute('aria-label'));
              }
            }
          });
        }
      });
    });
    
    const chatContainer = document.querySelector('[role="list"]') || 
                         document.querySelector('[data-testid="conversation-turn"]') ||
                         document.body;
    
    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ Real-time monitoring started');
    console.log('🛑 Run observer.disconnect() to stop monitoring');
    
    return observer;
  },
  
  // ============================================================================
  // GEMINI DEBUGGING
  // ============================================================================
  
  debugGemini() {
    console.log('\n💎 Starting Gemini Debugging...');
    
    const hostname = window.location.hostname;
    if (!hostname.includes('gemini.google.com')) {
      console.log('❌ Not on Gemini - current hostname:', hostname);
      return false;
    }
    
    console.log('✅ On Gemini platform');
    
    // Test 1: Check for key Gemini elements
    const textarea = document.querySelector('textarea');
    const sendButton = document.querySelector('button[aria-label*="Send"]') ||
                      document.querySelector('button[type="submit"]') ||
                      document.querySelector('button[data-testid*="send"]');
    const chatContainer = document.querySelector('[role="main"]') ||
                         document.querySelector('main') ||
                         document.querySelector('[data-testid*="chat"]');
    
    console.log('📝 Textarea found:', !!textarea);
    console.log('📤 Send button found:', !!sendButton);
    console.log('💬 Chat container found:', !!chatContainer);
    
    if (textarea) {
      console.log('📝 Textarea details:', {
        placeholder: textarea.placeholder,
        'data-testid': textarea.getAttribute('data-testid'),
        className: textarea.className,
        value: textarea.value
      });
    }
    
    // Test 2: Check for message elements
    const messages = document.querySelectorAll('[data-testid*="message"]');
    const userMessages = document.querySelectorAll('[data-testid*="user"]');
    const assistantMessages = document.querySelectorAll('[data-testid*="assistant"]');
    
    console.log('💬 Total messages:', messages.length);
    console.log('👤 User messages:', userMessages.length);
    console.log('🤖 Assistant messages:', assistantMessages.length);
    
    // Test 3: Check for analytics object
    if (window.cliffDiveAnalytics) {
      console.log('✅ Analytics object found');
      console.log('   Platform:', window.cliffDiveAnalytics.platform);
    } else {
      console.log('❌ Analytics object not found');
    }
    
    // Test 4: Test communication
    this.testGeminiCommunication();
    
    return true;
  },
  
  async testGeminiCommunication() {
    console.log('\n📡 Testing Gemini Communication...');
    
    try {
      // Test platform detection
      const platformResponse = await chrome.runtime.sendMessage({
        type: 'PLATFORM_DETECTED',
        platform: 'Gemini',
        url: window.location.href,
        timestamp: Date.now()
      });
      console.log('✅ Platform detection sent successfully');
      
      // Test analytics retrieval
      const analyticsResponse = await chrome.runtime.sendMessage({ 
        type: 'GET_ANALYTICS' 
      });
      console.log('✅ Analytics retrieved successfully');
      
      if (analyticsResponse && analyticsResponse.platformUsage) {
        const geminiData = analyticsResponse.platformUsage['Gemini'];
        if (geminiData) {
          console.log('📊 Gemini usage data:', {
            sessions: geminiData.totalSessions,
            time: geminiData.totalTime,
            messages: geminiData.totalMessages,
            lastUsed: geminiData.lastUsed
          });
        } else {
          console.log('⚠️ No Gemini usage data found');
        }
      }
      
    } catch (error) {
      console.log('❌ Communication failed:', error.message);
    }
  },
  
  // ============================================================================
  // PLATFORM DEBUGGING
  // ============================================================================
  
  debugPlatformDetection() {
    console.log('\n🎯 Testing Platform Detection...');
    
    const hostname = window.location.hostname;
    const url = window.location.href;
    
    console.log('📍 Current hostname:', hostname);
    console.log('🔗 Current URL:', url);
    
    // Check for supported platforms
    const platformTests = [
      { name: 'ChatGPT', patterns: ['chatgpt.com', 'chat.openai.com'] },
      { name: 'Claude', patterns: ['claude.ai'] },
      { name: 'Gemini', patterns: ['gemini.google.com'] },
      { name: 'Perplexity', patterns: ['perplexity.ai'] },
      { name: 'Poe', patterns: ['poe.com'] },
      { name: 'Grok', patterns: ['grok.x.ai'] },
      { name: 'Microsoft Copilot', patterns: ['copilot.microsoft.com'] },
      { name: 'Bing Chat', patterns: ['bing.com'] },
      { name: 'Google Bard', patterns: ['bard.google.com'] },
      { name: 'You.com', patterns: ['you.com'] },
      { name: 'Phind', patterns: ['phind.com'] },
      { name: 'Pi', patterns: ['pi.ai'] },
      { name: 'Character.AI', patterns: ['character.ai'] },
      { name: 'HuggingChat', patterns: ['huggingface.co'] },
      { name: 'DeepAI', patterns: ['deepai.org'] },
      { name: 'Replicate', patterns: ['replicate.com'] },
      { name: 'Runway', patterns: ['runwayml.com'] },
      { name: 'Midjourney', patterns: ['midjourney.com'] },
      { name: 'Stability AI', patterns: ['stability.ai'] },
      { name: 'Leonardo.AI', patterns: ['leonardo.ai'] },
      { name: 'Gamma', patterns: ['gamma.app'] },
      { name: 'Tome', patterns: ['tome.app'] },
      { name: 'Beautiful.AI', patterns: ['beautiful.ai'] },
      { name: 'Synthesia', patterns: ['synthesia.io'] },
      { name: 'Descript', patterns: ['descript.com'] },
      { name: 'ElevenLabs', patterns: ['elevenlabs.io'] },
      { name: 'Play.HT', patterns: ['play.ht'] },
      { name: 'Jasper', patterns: ['jasper.ai'] },
      { name: 'Copy.ai', patterns: ['copy.ai'] },
      { name: 'Writesonic', patterns: ['writesonic.com'] },
      { name: 'Rytr', patterns: ['rytr.me'] },
      { name: 'Simplified', patterns: ['simplified.co'] },
      { name: 'SurgeGraph', patterns: ['surgegraph.com'] },
      { name: 'Surfer', patterns: ['surfer.com'] },
      { name: 'Clearscope', patterns: ['clearscope.io'] },
      { name: 'Ahrefs AI', patterns: ['ahrefs.com'] },
      { name: 'SEMrush AI', patterns: ['semrush.com'] }
    ];
    
    let detectedPlatform = null;
    
    for (const platform of platformTests) {
      const isMatch = platform.patterns.some(pattern => 
        hostname.includes(pattern) || url.includes(pattern)
      );
      
      if (isMatch) {
        detectedPlatform = platform.name;
        console.log(`✅ Detected platform: ${platform.name}`);
        break;
      }
    }
    
    if (!detectedPlatform) {
      console.log('❌ No supported platform detected');
      console.log('💡 Supported platforms:', platformTests.map(p => p.name).join(', '));
    }
    
    return detectedPlatform;
  },
  
  // ============================================================================
  // FORCE TRACKING
  // ============================================================================
  
  async forceChatGPTTracking() {
    console.log('\n🚀 Starting Force ChatGPT Tracking...');
    
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.log('❌ Chrome extension not available');
      return;
    }
    
    const hostname = window.location.hostname;
    if (!hostname.includes('chatgpt.com') && !hostname.includes('chat.openai.com')) {
      console.log('❌ Not on ChatGPT - current hostname:', hostname);
      return;
    }
    
    console.log('✅ On ChatGPT platform, starting force tracking...');
    
    // Send platform detected message
    try {
      await chrome.runtime.sendMessage({
        type: 'PLATFORM_DETECTED',
        platform: 'ChatGPT',
        url: window.location.href,
        timestamp: Date.now()
      });
      console.log('✅ Platform detection sent');
    } catch (error) {
      console.log('❌ Platform detection failed:', error.message);
    }
    
    // Monitor for interactions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.getAttribute && node.getAttribute('aria-label')) {
                const label = node.getAttribute('aria-label');
                if (label === 'User' || label === 'Assistant') {
                  console.log(`🆕 ${label} message detected, sending interaction...`);
                  
                  chrome.runtime.sendMessage({
                    type: 'AI_INTERACTION',
                    platform: 'ChatGPT',
                    interaction: label === 'User' ? 'message_sent' : 'message_received',
                    timestamp: Date.now()
                  }).then(() => {
                    console.log('✅ Interaction sent successfully');
                  }).catch((error) => {
                    console.log('❌ Interaction failed:', error.message);
                  });
                }
              }
            }
          });
        }
      });
    });
    
    const chatContainer = document.querySelector('[role="list"]') || 
                         document.querySelector('[data-testid="conversation-turn"]') ||
                         document.body;
    
    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ Force tracking started');
    console.log('🛑 Run observer.disconnect() to stop tracking');
    
    return observer;
  },
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  getPlatformInfo() {
    const hostname = window.location.hostname;
    const url = window.location.href;
    
    return {
      hostname,
      url,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  },
  
  // ============================================================================
  // EXPORT FUNCTIONS
  // ============================================================================
  
  // Make functions available globally
  exportToWindow() {
    window.debugPlatforms = this;
    console.log('🎯 Debug Platforms functions exported to window.debugPlatforms');
  }
};

// Auto-export to window
DebugPlatforms.exportToWindow();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugPlatforms;
} 