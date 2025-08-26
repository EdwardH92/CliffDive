// Content Script for AI Interaction Detection
// Privacy-first: Only tracks interaction patterns, never content

class AIInteractionDetector {
  constructor() {
    this.platform = this.detectPlatform();
    this.interactionCount = 0;
    this.lastInteraction = Date.now();
    this.observers = [];
    this.isActive = false;
    
    if (this.platform) {
      this.initialize();
    }
  }
  
  detectPlatform() {
    const hostname = window.location.hostname;
    
    // Tier 1 platforms (high confidence) - Pure AI tools
    if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
      return { name: 'ChatGPT', tier: 1, type: 'llm' };
    } else if (hostname.includes('claude.ai')) {
      return { name: 'Claude', tier: 1, type: 'llm' };
    } else if (hostname.includes('gemini.google.com')) {
      return { name: 'Gemini', tier: 1, type: 'llm' };
    } else if (hostname.includes('perplexity.ai')) {
      return { name: 'Perplexity', tier: 1, type: 'search' };
    } else if (hostname.includes('poe.com')) {
      return { name: 'Poe', tier: 1, type: 'llm' };
    } else if (hostname.includes('grok.x.ai')) {
      return { name: 'Grok', tier: 1, type: 'llm' };
    } else if (hostname.includes('copilot.microsoft.com')) {
      return { name: 'Microsoft Copilot', tier: 1, type: 'llm' };
    } else if (hostname.includes('bing.com') && hostname.includes('chat')) {
      return { name: 'Bing Chat', tier: 1, type: 'search' };
    } else if (hostname.includes('bard.google.com')) {
      return { name: 'Google Bard', tier: 1, type: 'llm' };
    } else if (hostname.includes('you.com')) {
      return { name: 'You.com', tier: 1, type: 'search' };
    } else if (hostname.includes('phind.com')) {
      return { name: 'Phind', tier: 1, type: 'search' };
    } else if (hostname.includes('pi.ai')) {
      return { name: 'Pi', tier: 1, type: 'llm' };
    } else if (hostname.includes('character.ai')) {
      return { name: 'Character.AI', tier: 1, type: 'llm' };
    } else if (hostname.includes('huggingface.co') && hostname.includes('chat')) {
      return { name: 'HuggingChat', tier: 1, type: 'llm' };
    } else if (hostname.includes('deepai.org')) {
      return { name: 'DeepAI', tier: 1, type: 'llm' };
    } else if (hostname.includes('replicate.com')) {
      return { name: 'Replicate', tier: 1, type: 'llm' };
    } else if (hostname.includes('runwayml.com')) {
      return { name: 'Runway', tier: 1, type: 'creative' };
    } else if (hostname.includes('midjourney.com')) {
      return { name: 'Midjourney', tier: 1, type: 'creative' };
    } else if (hostname.includes('stability.ai')) {
      return { name: 'Stability AI', tier: 1, type: 'creative' };
    } else if (hostname.includes('leonardo.ai')) {
      return { name: 'Leonardo.AI', tier: 1, type: 'creative' };
    } else if (hostname.includes('gamma.app')) {
      return { name: 'Gamma', tier: 1, type: 'productivity' };
    } else if (hostname.includes('tome.app')) {
      return { name: 'Tome', tier: 1, type: 'productivity' };
    } else if (hostname.includes('beautiful.ai')) {
      return { name: 'Beautiful.AI', tier: 1, type: 'productivity' };
    } else if (hostname.includes('synthesia.io')) {
      return { name: 'Synthesia', tier: 1, type: 'creative' };
    } else if (hostname.includes('descript.com')) {
      return { name: 'Descript', tier: 1, type: 'creative' };
    } else if (hostname.includes('elevenlabs.io')) {
      return { name: 'ElevenLabs', tier: 1, type: 'creative' };
    } else if (hostname.includes('play.ht')) {
      return { name: 'Play.HT', tier: 1, type: 'creative' };
    } else if (hostname.includes('jasper.ai')) {
      return { name: 'Jasper', tier: 1, type: 'writing' };
    } else if (hostname.includes('copy.ai')) {
      return { name: 'Copy.ai', tier: 1, type: 'writing' };
    } else if (hostname.includes('writesonic.com')) {
      return { name: 'Writesonic', tier: 1, type: 'writing' };
    } else if (hostname.includes('rytr.me')) {
      return { name: 'Rytr', tier: 1, type: 'writing' };
    } else if (hostname.includes('simplified.co')) {
      return { name: 'Simplified', tier: 1, type: 'writing' };
    } else if (hostname.includes('surgegraph.com')) {
      return { name: 'SurgeGraph', tier: 1, type: 'seo' };
    } else if (hostname.includes('surfer.com')) {
      return { name: 'Surfer', tier: 1, type: 'seo' };
    } else if (hostname.includes('clearscope.io')) {
      return { name: 'Clearscope', tier: 1, type: 'seo' };
    } else if (hostname.includes('ahrefs.com') && hostname.includes('ai')) {
      return { name: 'Ahrefs AI', tier: 1, type: 'seo' };
    } else if (hostname.includes('semrush.com') && hostname.includes('ai')) {
      return { name: 'SEMrush AI', tier: 1, type: 'seo' };
    }
    
    return null;
  }
  
  initialize() {
    console.log(`AI Analytics: Monitoring ${this.platform.name} on ${window.location.hostname}`);
    
    // Start monitoring after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
    } else {
      this.startMonitoring();
    }
    
    // Monitor for dynamic content changes
    this.observeDOMChanges();
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.isActive = !document.hidden;
      console.log(`AI Analytics: Page visibility changed to ${this.isActive ? 'active' : 'inactive'}`);
    });
    
    // Send initial platform detection
    this.sendAnalytics({
      type: 'PLATFORM_DETECTED',
      platform: this.platform.name,
      url: window.location.href,
      timestamp: Date.now()
    });
  }
  
  startMonitoring() {
    this.setupPlatformSpecificMonitoring();
    this.setupGeneralInteractionMonitoring();
  }
  
  setupPlatformSpecificMonitoring() {
    switch (this.platform.name) {
      case 'ChatGPT':
        this.monitorChatGPT();
        break;
      case 'Claude':
        this.monitorClaude();
        break;
      case 'Gemini':
        this.monitorGemini();
        break;
      case 'Notion AI':
        this.monitorNotionAI();
        break;
      case 'Canva AI':
        this.monitorCanvaAI();
        break;
      default:
        this.monitorGenericAI();
    }
  }
  
  monitorChatGPT() {
    console.log('🔍 Setting up ChatGPT monitoring with ChatGPT team recommendations...');
    
    // ChatGPT team approach: waitForAppReady pattern
    this.waitForAppReady().then(() => {
      console.log('✅ ChatGPT app is ready, setting up monitoring...');
      this.setupChatGPTMonitoring();
    }).catch(error => {
      console.error('❌ Failed to wait for ChatGPT app ready:', error);
      // Fallback: try setup anyway
      this.setupChatGPTMonitoring();
    });
  }
  
  async waitForAppReady() {
    console.log('⏳ Waiting for ChatGPT app to be ready...');
    
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 20; // 20 attempts
      const checkInterval = 500; // Check every 500ms
      
      const checkForAppReady = () => {
        attempts++;
        console.log(`🔄 App ready check attempt ${attempts}/${maxAttempts}`);
        
        // Check for chat container (ChatGPT team recommendation)
        const chatContainer = document.querySelector('[role="list"]') || 
                             document.querySelector('[data-testid="conversation-turn"]') ||
                             document.querySelector('main');
        
        // Check for textarea (input area)
        const textarea = document.querySelector('textarea');
        
        // Check for message blocks (ChatGPT team recommendation)
        const messageBlocks = document.querySelectorAll('[role="listitem"]');
        
        console.log('📊 App ready check results:');
        console.log(`   - Chat container: ${!!chatContainer}`);
        console.log(`   - Textarea: ${!!textarea}`);
        console.log(`   - Message blocks: ${messageBlocks.length}`);
        
        if (chatContainer || textarea || messageBlocks.length > 0) {
          console.log('✅ ChatGPT app is ready!');
          resolve();
        } else if (attempts < maxAttempts) {
          console.log(`⏳ App not ready yet, retrying in ${checkInterval}ms...`);
          setTimeout(checkForAppReady, checkInterval);
        } else {
          console.log('❌ App ready timeout reached');
          reject(new Error('ChatGPT app ready timeout'));
        }
      };
      
      // Start checking
      checkForAppReady();
    });
  }
  
  setupChatGPTMonitoring() {
    console.log('🎯 Setting up ChatGPT monitoring with team recommendations...');
    
    // Strategy 1: MutationObserver watching for new message blocks (ChatGPT team recommendation)
    this.setupMessageBlockObserver();
    
    // Strategy 2: ARIA label detection (ChatGPT team recommendation)
    this.setupAriaLabelDetection();
    
    // Strategy 3: Network request interception
    this.setupNetworkInterception();
    
    // Strategy 4: Event delegation with stable attributes
    this.setupEventDelegation();
    
    // Strategy 5: Periodic health checks
    this.setupHealthChecks();
    
    // Strategy 6: Fallback element observation
    this.setupFallbackObservation();
  }
  
  setupMessageBlockObserver() {
    console.log('🔍 Setting up message block observer (ChatGPT team recommendation)...');
    
    // Debounced callback to limit how often the mutation handler runs (ChatGPT team recommendation)
    let debounceTimer;
    const debouncedCallback = (mutations) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.processMessageBlockMutations(mutations);
      }, 150); // 150ms debounce (ChatGPT team recommendation)
    };
    
    // Create observer watching for new message blocks (ChatGPT team recommendation)
    const observer = new MutationObserver(debouncedCallback);
    
    // Watch for new list items with role="listitem" (ChatGPT team recommendation)
    const chatContainer = document.querySelector('[role="list"]') || 
                         document.querySelector('[data-testid="conversation-turn"]') ||
                         document.querySelector('main');
    
    if (chatContainer) {
      observer.observe(chatContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['role', 'aria-label', 'data-testid']
      });
      console.log('✅ Message block observer setup complete - watching chat container');
    } else {
      // Fallback: observe body
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['role', 'aria-label', 'data-testid']
      });
      console.log('✅ Message block observer setup complete - watching body (fallback)');
    }
    
    this.observers.push(observer);
  }
  
  processMessageBlockMutations(mutations) {
    mutations.forEach(mutation => {
      // Handle added nodes (new message blocks)
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          this.handleNewMessageBlock(node);
          
          // Also check children for message blocks
          node.querySelectorAll && node.querySelectorAll('[role="listitem"]').forEach(child => {
            this.handleNewMessageBlock(child);
          });
        }
      });
      
      // Handle attribute changes
      if (mutation.type === 'attributes') {
        this.handleMessageBlockAttributeChange(mutation.target);
      }
    });
  }
  
  handleNewMessageBlock(element) {
    try {
      // Safely get className
      const className = typeof element.className === 'string' ? element.className : 
                       element.className instanceof DOMTokenList ? Array.from(element.className).join(' ') : '';
      
      // Check for user message
      if (element.matches('[data-testid="conversation-turn"]') || 
          element.matches('[role="listitem"]') ||
          element.querySelector('[data-message-author-role="user"]')) {
        this.trackInteraction('message_sent');
        return;
      }

      // Check for assistant response
      if (element.querySelector('[data-message-author-role="assistant"]') ||
          element.matches('[data-testid="conversation-turn-assistant"]')) {
        this.trackResponseReceived();
        return;
      }
    } catch (error) {
      console.error('Error handling message block:', error);
    }
  }
  
  handleMessageBlockAttributeChange(element) {
    // Handle changes to message block attributes
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    
    if (role === 'listitem') {
      console.log('🔄 Message block attribute changed:', { role, ariaLabel });
      
      if (ariaLabel === 'User') {
        console.log('👤 User message attribute detected');
        this.trackInteraction('message_sent');
      } else if (ariaLabel === 'Assistant') {
        console.log('🤖 Assistant message attribute detected');
        this.trackResponseReceived();
      }
    }
  }
  
  setupAriaLabelDetection() {
    console.log('🎯 Setting up ARIA label detection (ChatGPT team recommendation)...');
    
    // Check for existing ARIA labels (ChatGPT team recommendation)
    this.checkExistingAriaLabels();
    
    // Set up observer for new ARIA labels
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
          this.handleAriaLabelChange(mutation.target);
        }
      });
    });
    
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label']
    });
    
    this.observers.push(observer);
    console.log('✅ ARIA label detection setup complete');
  }
  
  checkExistingAriaLabels() {
    console.log('🔍 Checking for existing ARIA labels...');
    
    // Check for user messages (ChatGPT team recommendation)
    const userLabels = document.querySelectorAll('[aria-label="User"]');
    console.log(`👤 Found ${userLabels.length} existing user ARIA labels`);
    
    // Check for assistant messages (ChatGPT team recommendation)
    const assistantLabels = document.querySelectorAll('[aria-label="Assistant"]');
    console.log(`🤖 Found ${assistantLabels.length} existing assistant ARIA labels`);
    
    // Check for send button ARIA labels
    const sendLabels = document.querySelectorAll('[aria-label*="Send"]');
    console.log(`📤 Found ${sendLabels.length} existing send button ARIA labels`);
    
    // Log details for debugging (ChatGPT team recommendation)
    userLabels.forEach((label, index) => {
      console.log(`👤 User label ${index + 1}:`, {
        tagName: label.tagName,
        className: label.className || '',
        textContent: label.textContent?.substring(0, 50) + '...'
      });
    });
    
    assistantLabels.forEach((label, index) => {
      console.log(`🤖 Assistant label ${index + 1}:`, {
        tagName: label.tagName,
        className: label.className || '',
        textContent: label.textContent?.substring(0, 50) + '...'
      });
    });
  }
  
  handleAriaLabelChange(element) {
    const ariaLabel = element.getAttribute('aria-label');
    
    if (ariaLabel === 'User') {
      console.log('👤 User ARIA label detected');
      this.trackInteraction('message_sent');
    } else if (ariaLabel === 'Assistant') {
      console.log('🤖 Assistant ARIA label detected');
      this.trackResponseReceived();
    } else if (ariaLabel && ariaLabel.includes('Send')) {
      console.log('📤 Send button ARIA label detected:', ariaLabel);
      this.trackSendButton(element);
    }
  }
  
  processChatGPTMutations(mutations) {
    mutations.forEach(mutation => {
      // Handle added nodes
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          this.handleChatGPTElement(node);
          
          // Also check children
          node.querySelectorAll && node.querySelectorAll('*').forEach(child => {
            this.handleChatGPTElement(child);
          });
        }
      });
      
      // Handle attribute changes
      if (mutation.type === 'attributes') {
        this.handleChatGPTElement(mutation.target);
      }
    });
  }
  
  setupNetworkInterception() {
    console.log('🌐 Setting up network interception for ChatGPT...');
    
    // Intercept fetch requests to detect API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Check if this is a ChatGPT API call
      if (args[0] && typeof args[0] === 'string' && args[0].includes('/api/')) {
        console.log('🌐 ChatGPT API call detected:', args[0]);
        
        // If it's a POST request, likely a message being sent
        if (args[1] && args[1].method === 'POST') {
          console.log('📤 ChatGPT message API call detected');
          this.trackInteraction('message_sent');
        }
      }
      
      return response;
    };
    
    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (url && url.includes('/api/')) {
        console.log('🌐 ChatGPT XHR API call detected:', url);
        
        if (method === 'POST') {
          console.log('📤 ChatGPT message XHR call detected');
          // Track after a short delay to ensure the request is actually sent
          setTimeout(() => {
            window.cliffDiveAnalytics?.trackInteraction('message_sent');
          }, 100);
        }
      }
      
      return originalXHROpen.call(this, method, url, ...args);
    };
    
    console.log('✅ Network interception setup complete');
  }
  
  setupEventDelegation() {
    console.log('🎯 Setting up event delegation for ChatGPT...');
    
    // Use event delegation for more reliable event capture
    document.addEventListener('click', (event) => {
      this.handleChatGPTClick(event);
    }, true); // Use capture phase
    
    document.addEventListener('submit', (event) => {
      this.handleChatGPTSubmit(event);
    }, true);
    
    document.addEventListener('input', (event) => {
      this.handleChatGPTInput(event);
    }, true);
    
    console.log('✅ Event delegation setup complete');
  }
  
  handleChatGPTClick(event) {
    const target = event.target;
    
    // Check for send button clicks using stable attributes
    if (target.tagName === 'BUTTON') {
      const testId = target.getAttribute('data-testid');
      const ariaLabel = target.getAttribute('aria-label');
      const type = target.getAttribute('type');
      
      if (testId === 'send-button' || 
          ariaLabel?.includes('Send') || 
          type === 'submit') {
        console.log('📤 ChatGPT send button clicked via event delegation');
        this.trackSendButton(target);
      }
    }
  }
  
  handleChatGPTSubmit(event) {
    // Check if this is a ChatGPT form submission
    const form = event.target;
    const textarea = form.querySelector('textarea');
    
    if (textarea) {
      console.log('📤 ChatGPT form submitted via event delegation');
      this.trackSendButton(form.querySelector('button[type="submit"]') || form);
    }
  }
  
  handleChatGPTInput(event) {
    const target = event.target;
    
    if (target.tagName === 'TEXTAREA') {
      console.log('📝 ChatGPT textarea input via event delegation');
      this.trackInputInteraction(target);
    }
  }
  
  setupHealthChecks() {
    console.log('🏥 Setting up health checks for ChatGPT...');
    
    // Periodic health checks every 5 seconds
    setInterval(() => {
      this.performChatGPTHealthCheck();
    }, 5000);
    
    console.log('✅ Health checks setup complete');
  }
  
  setupFallbackObservation() {
    console.log('🔄 Setting up fallback observation for ChatGPT...');
    
    // Fallback selectors for comprehensive coverage
    const fallbackSelectors = [
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="Send a message"]',
      'textarea[data-id="root"]',
      'textarea[data-testid="chat-input"]',
      'button[data-testid="send-button"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="Send message"]',
      'button[data-state="closed"]',
      'button[type="submit"]',
      'button:has(svg)',
      '[data-message-author-role="assistant"]',
      '.markdown',
      '.prose',
      '.text-base',
      '[data-message-author-role]',
      '.whitespace-pre-wrap'
    ];
    
    this.observeElements(fallbackSelectors, (element) => {
      this.handleChatGPTElement(element);
    });
    
    console.log('✅ Fallback observation setup complete');
  }
  
  performChatGPTHealthCheck() {
    // Check if key elements still exist
    const textarea = document.querySelector('textarea');
    const conversationTurns = document.querySelectorAll('[data-testid="conversation-turn"]');
    const sendButton = document.querySelector('button[type="submit"]');
    
    if (!textarea && !conversationTurns.length && !sendButton) {
      console.log('⚠️ ChatGPT health check failed - key elements missing, reinitializing...');
      this.monitorChatGPT(); // Reinitialize monitoring
    }
  }
  
  handleChatGPTElement(element) {
    // Enhanced element handling with multiple detection strategies
    
    // Strategy 1: Stable attribute detection
    const testId = element.getAttribute('data-testid');
    const ariaLabel = element.getAttribute('aria-label');
    const placeholder = element.getAttribute('placeholder');
    
    // Strategy 2: Tag-based detection
    const tagName = element.tagName;
    
    // Strategy 3: Content-based detection
    const textContent = element.textContent?.toLowerCase();
    
    // Enhanced textarea detection
    if (tagName === 'TEXTAREA') {
      console.log('📝 ChatGPT textarea detected via robust monitoring');
        this.trackInputInteraction(element);
      return;
    }
    
    // Enhanced conversation turn detection
    if (testId === 'conversation-turn') {
      console.log('💬 ChatGPT conversation turn detected via robust monitoring');
      this.trackResponseReceived();
      return;
    }
    
    // Enhanced send button detection
    if (tagName === 'BUTTON' && (
      testId === 'send-button' ||
      ariaLabel?.includes('Send') ||
      element.getAttribute('type') === 'submit' ||
      textContent?.includes('send')
    )) {
      console.log('📤 ChatGPT send button detected via robust monitoring');
        this.trackSendButton(element);
      return;
    }
    
    // Enhanced message container detection
    if (tagName === 'MAIN' || tagName === 'SECTION') {
      // Check if this container has conversation content
      const hasConversation = element.querySelector('[data-testid="conversation-turn"]') ||
                             element.querySelector('.markdown') ||
                             element.querySelector('.prose');
      
      if (hasConversation) {
        console.log('📦 ChatGPT message container detected via robust monitoring');
        // Don't track immediately, but mark as detected
      }
    }
    
    // Fallback: Check for any AI-related content
    if (textContent && (
      textContent.includes('assistant') ||
      textContent.includes('user') ||
      textContent.includes('message')
    )) {
      console.log('🤖 ChatGPT AI content detected via robust monitoring');
      // Could track as general AI interaction
      }
  }
  
  monitorSendButtonNearTextarea(textarea) {
    // Look for send button near the textarea
    const nearbyButton = textarea.closest('form')?.querySelector('button[type="submit"]') ||
                        textarea.parentElement?.querySelector('button[type="submit"]') ||
                        textarea.nextElementSibling?.querySelector('button[type="submit"]');
    
    if (nearbyButton) {
      console.log('🔍 Found send button near textarea');
      // The button will be handled by the main observer
    }
  }
  
  monitorClaude() {
    console.log('🔍 Setting up Claude monitoring...');
    
    // Updated Claude selectors (as of 2024)
    const selectors = [
      // Input area
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="Send a message"]',
      'textarea[data-testid="message-input"]',
      
      // Send button
      'button[aria-label*="Send"]',
      'button[aria-label*="Send message"]',
      'button[data-testid="send-button"]',
      
      // Response areas
      '.claude-message',
      '[data-testid="message"]',
      '.message-content',
      '[data-message-type="assistant"]'
    ];
    
    this.observeElements(selectors, (element) => {
      // Ensure element is an actual HTML element before accessing properties
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
      
      console.log('🎯 Claude element detected:', element.tagName, element.className || '', element.getAttribute('data-testid') || '');
      
      if (element.matches('textarea[placeholder*="Message"]') ||
          element.matches('textarea[placeholder*="Send a message"]') ||
          element.matches('textarea[data-testid="message-input"]')) {
        console.log('📝 Claude input detected');
        this.trackInputInteraction(element);
      } else if (element.matches('button[aria-label*="Send"]') ||
                 element.matches('button[aria-label*="Send message"]') ||
                 element.matches('button[data-testid="send-button"]')) {
        console.log('📤 Claude send button detected');
        this.trackSendButton(element);
      } else if (element.matches('.claude-message') ||
                 element.matches('[data-testid="message"]') ||
                 element.matches('.message-content')) {
        console.log('🤖 Claude response detected');
        this.trackResponseReceived();
      }
    });
  }
  
  monitorGemini() {
    console.log('🔍 Setting up Gemini monitoring with robust detection...');
    
    // Wait for Gemini to be ready, then set up monitoring
    this.waitForGeminiReady().then(() => {
      this.setupGeminiMonitoring();
    });
  }
  
  async waitForGeminiReady() {
    console.log('⏳ Waiting for Gemini to be ready...');
    
    const maxAttempts = 20;
    const checkInterval = 500;
    let attempts = 0;
    
    return new Promise((resolve) => {
      const checkForGeminiReady = () => {
        attempts++;
        
        // Check for key Gemini elements
        const textarea = document.querySelector('textarea');
        const sendButton = document.querySelector('button[aria-label*="Send"], button[data-testid="send-button"], button[type="submit"]');
        const chatContainer = document.querySelector('[data-testid="chat-container"], .chat-container, main');
        
        if (textarea || sendButton || chatContainer) {
          console.log('✅ Gemini ready - key elements found');
          resolve();
        } else if (attempts >= maxAttempts) {
          console.log('⚠️ Gemini ready timeout - proceeding anyway');
          resolve();
        } else {
          setTimeout(checkForGeminiReady, checkInterval);
        }
      };
      
      checkForGeminiReady();
    });
  }
  
  setupGeminiMonitoring() {
    console.log('🔧 Setting up comprehensive Gemini monitoring...');
    
    // Set up multiple monitoring strategies
    this.setupGeminiMessageObserver();
    this.setupGeminiEventDelegation();
    this.setupGeminiNetworkInterception();
    this.setupGeminiHealthChecks();
    this.setupGeminiFallbackObservation();
  }
  
  setupGeminiMessageObserver() {
    console.log('👀 Setting up Gemini message observer...');
    
    const debouncedCallback = (mutations) => {
      setTimeout(() => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.handleGeminiElement(node);
              }
            });
          }
        });
      }, 150); // 150ms debounce
    };
    
    const observer = new MutationObserver(debouncedCallback);
    
    // Observe the entire document for Gemini message changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-testid', 'aria-label', 'class']
    });
    
    this.observers.push(observer);
    console.log('✅ Gemini message observer started');
  }
  
  setupGeminiEventDelegation() {
    console.log('🎯 Setting up Gemini event delegation...');
    
    // Listen for clicks on send buttons
    document.addEventListener('click', (event) => {
      this.handleGeminiClick(event);
    }, true);
    
    // Listen for form submissions
    document.addEventListener('submit', (event) => {
      this.handleGeminiSubmit(event);
    }, true);
    
    // Listen for input events
    document.addEventListener('input', (event) => {
      this.handleGeminiInput(event);
    }, true);
    
    console.log('✅ Gemini event delegation started');
  }
  
  setupGeminiNetworkInterception() {
    console.log('🌐 Setting up Gemini network interception...');
    
    // Override fetch to detect Gemini API calls
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const url = args[0];
      if (typeof url === 'string' && url.includes('/api/')) {
        console.log('🌐 Gemini API call detected:', url);
        this.trackInteraction('message_sent');
      }
      return originalFetch.apply(this, args);
    };
    
    // Override XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (method === 'POST' && typeof url === 'string' && url.includes('/api/')) {
        console.log('🌐 Gemini XHR API call detected:', url);
        window.cliffDiveAnalytics?.trackInteraction('message_sent');
      }
      return originalOpen.apply(this, [method, url, ...args]);
    };
    
    console.log('✅ Gemini network interception started');
  }
  
  setupGeminiHealthChecks() {
    console.log('🏥 Setting up Gemini health checks...');
    
    setInterval(() => {
      this.performGeminiHealthCheck();
    }, 5000); // Check every 5 seconds
    
    console.log('✅ Gemini health checks started');
  }
  
  setupGeminiFallbackObservation() {
    console.log('🔄 Setting up Gemini fallback observation...');
    
    const fallbackSelectors = [
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="Send a message"]',
      'textarea[data-testid="input"]',
      'textarea[aria-label*="Input"]',
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="ask"]',
      'textarea[placeholder*="Type"]',
      'textarea[placeholder*="type"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="Send message"]',
      'button[data-testid="send-button"]',
      'button[data-icon="send"]',
      'button[type="submit"]',
      'button:has(svg)',
      'button[aria-label*="Submit"]',
      '.response-content',
      '[data-message-type]',
      '.message-content',
      '[data-testid="response"]',
      '.gemini-response',
      '.response-text',
      '[data-testid="message"]',
      '.message-text'
    ];
    
    this.observeElements(fallbackSelectors, (element) => {
      this.handleGeminiElement(element);
    });
    
    console.log('✅ Gemini fallback observation started');
  }
  
  handleGeminiElement(element) {
    // Ensure element is an actual HTML element
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    
    console.log('🎯 Gemini element detected:', element.tagName, element.className || '', element.getAttribute('data-testid') || '');
    
    // Check for input elements
    if (element.tagName === 'TEXTAREA') {
      const placeholder = element.placeholder?.toLowerCase() || '';
      const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
      const dataTestid = element.getAttribute('data-testid')?.toLowerCase() || '';
      
      if (placeholder.includes('message') || placeholder.includes('ask') || placeholder.includes('type') ||
          ariaLabel.includes('input') || dataTestid.includes('input')) {
        console.log('📝 Gemini input detected');
        this.trackInputInteraction(element);
      }
    }
    
    // Check for send buttons
    if (element.tagName === 'BUTTON') {
      const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
      const dataTestid = element.getAttribute('data-testid')?.toLowerCase() || '';
      const type = element.getAttribute('type');
      
      if (ariaLabel.includes('send') || dataTestid.includes('send') || type === 'submit') {
        console.log('📤 Gemini send button detected');
        this.trackSendButton(element);
      }
    }
    
    // Check for response elements
    const className = String(element.className || '').toLowerCase();
    const dataTestid = String(element.getAttribute('data-testid') || '').toLowerCase();

    if (className.includes('response') || className.includes('message') ||
      dataTestid.includes('response') || dataTestid.includes('message')) {
      console.log('🤖 Gemini response detected');
      this.trackResponseReceived();
    }
  }
  
  handleGeminiClick(event) {
    const target = event.target;
    if (!target || target.nodeType !== Node.ELEMENT_NODE || target.tagName !== 'BUTTON') return;
    
    const ariaLabel = target.getAttribute('aria-label')?.toLowerCase() || '';
    const dataTestid = target.getAttribute('data-testid')?.toLowerCase() || '';
    const type = target.getAttribute('type');
    
    if (ariaLabel.includes('send') || dataTestid.includes('send') || type === 'submit') {
      console.log('📤 Gemini send button click detected');
      this.trackInteraction('message_sent');
    }
  }
  
  handleGeminiSubmit(event) {
    console.log('📤 Gemini form submission detected');
    this.trackInteraction('message_sent');
  }
  
    handleGeminiInput(event) {
    const target = event.target;
    if (!target || target.nodeType !== Node.ELEMENT_NODE || target.tagName !== 'TEXTAREA') return;
    
    const placeholder = target.placeholder?.toLowerCase() || '';
    if (placeholder.includes('message') || placeholder.includes('ask') || placeholder.includes('type')) {
      console.log('📝 Gemini input detected');
      this.trackInputInteraction(target);
    }
  }
  
  performGeminiHealthCheck() {
    const textarea = document.querySelector('textarea');
    const sendButton = document.querySelector('button[aria-label*="Send"], button[data-testid="send-button"], button[type="submit"]');
    
    if (!textarea && !sendButton) {
      console.log('⚠️ Gemini health check failed - key elements missing, reinitializing...');
      this.monitorGemini();
    }
  }
  
  monitorNotionAI() {
    // Monitor Notion AI features
    const selectors = [
      '.ai-block',
      '[data-ai]',
      '.notion-ai',
      'button[aria-label*="AI"]'
    ];
    
    this.observeElements(selectors, (element) => {
      if (element.matches('button[aria-label*="AI"]')) {
        this.trackAIButtonClick(element);
      } else if (element.matches('.ai-block')) {
        this.trackAIFeatureUsage();
      }
    });
  }
  
  monitorCanvaAI() {
    // Monitor Canva AI features
    const selectors = [
      '[data-ai-feature]',
      '.ai-tool',
      '[aria-label*="AI"]',
      '.magic-button'
    ];
    
    this.observeElements(selectors, (element) => {
      if (element.matches('[data-ai-feature]') || element.matches('.ai-tool')) {
        this.trackAIFeatureUsage();
      } else if (element.matches('.magic-button')) {
        this.trackAIButtonClick(element);
      }
    });
  }
  
  monitorGenericAI() {
    // Generic monitoring for Tier 2 platforms
    const aiSelectors = [
      '[data-ai]',
      '[data-ai-feature]',
      '.ai-tool',
      '.ai-feature',
      '[aria-label*="AI"]',
      '[title*="AI"]',
      'button[class*="ai"]',
      'button[class*="AI"]'
    ];
    
    this.observeElements(aiSelectors, (element) => {
      this.trackAIFeatureUsage();
    });
  }
  
  setupGeneralInteractionMonitoring() {
    // Monitor general user interactions that might indicate AI usage
    document.addEventListener('click', (event) => {
      if (this.isActive && this.isAIFeature(event.target)) {
        this.trackInteraction('click');
      }
    });
    
    document.addEventListener('input', (event) => {
      if (this.isActive && this.isAIInput(event.target)) {
        this.trackInteraction('input');
      }
    });
    
    document.addEventListener('keydown', (event) => {
      if (this.isActive && event.key === 'Enter' && this.isAIInput(event.target)) {
        this.trackInteraction('enter');
      }
    });
  }
  
  isAIFeature(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    
    const aiKeywords = ['ai', 'AI', 'magic', 'smart', 'assistant', 'generate'];
    const text = element.textContent?.toLowerCase() || '';
    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
    const title = element.getAttribute('title')?.toLowerCase() || '';
    const className = String(element.className || '').toLowerCase();
    
    return aiKeywords.some(keyword => 
      text.includes(keyword) || 
      ariaLabel.includes(keyword) || 
      title.includes(keyword) || 
      className.includes(keyword)
    );
  }
  
  isAIInput(element) {
    if (!element) return false;
    
    const aiSelectors = [
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="AI"]',
      'input[placeholder*="AI"]',
      '[contenteditable="true"]'
    ];
    
    return aiSelectors.some(selector => element.matches(selector));
  }
  
  observeElements(selectors, callback) {
    selectors.forEach(selector => {
      try {
      // Initial elements
      document.querySelectorAll(selector).forEach(callback);
      
      // Observe for new elements
      const observer = new MutationObserver((mutations) => {
          try {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches(selector)) {
                callback(node);
              }
              node.querySelectorAll(selector).forEach(callback);
            }
          });
        });
          } catch (error) {
            console.error('❌ Error in mutation observer:', error);
            // Disconnect observer on error to prevent further issues
            observer.disconnect();
          }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      this.observers.push(observer);
      } catch (error) {
        console.error('❌ Error setting up observer for selector:', selector, error);
      }
    });
  }
  
  observeDOMChanges() {
    // Monitor for dynamic content that might be AI-related
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkForAIElements(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    this.observers.push(observer);
  }
  
  checkForAIElements(element) {
    // Ensure element is an actual HTML element
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    
    // Look for AI-related content without reading actual text
    const aiIndicators = [
      '[class*="ai"]',
      '[class*="AI"]',
      '[data-ai]',
      '[aria-label*="AI"]',
      '[title*="AI"]'
    ];
    
    aiIndicators.forEach(selector => {
      if (element.matches(selector) || element.querySelector(selector)) {
        this.trackAIFeatureUsage();
      }
    });
  }
  
  trackInteraction(type) {
    try {
      // Prevent duplicate tracking within a short time window
      const now = Date.now();
      if (now - this.lastInteraction < 1000) { // 1 second debounce
        return;
      }
      this.lastInteraction = now;
      
      console.log(`📊 Tracking interaction: ${type}`);
      
      // Send analytics
      this.sendAnalytics({
        type: 'AI_INTERACTION',
        subtype: type,
        timestamp: now,
        platform: this.detectPlatform(),
        url: window.location.href
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }
  
  trackInputInteraction(element) {
    // Track when user starts typing in AI input fields
    this.trackInteraction('input_start');
  }
  
  trackSendButton(element) {
    // Track when user sends a message
    this.trackInteraction('message_sent');
  }
  
  trackResponseReceived() {
    // Track when AI response is received
    this.trackInteraction('response_received');
  }
  
  trackAIButtonClick(element) {
    // Track AI feature button clicks
    this.trackInteraction('ai_button_click');
  }
  
  trackAIFeatureUsage() {
    // Track general AI feature usage
    this.trackInteraction('ai_feature_usage');
  }
  
  sendAnalytics(data) {
    // Check if chrome.runtime is available
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      this.storeAnalyticsLocally(data);
      return;
    }
    
    // Check if extension context is valid
    try {
      // Test if extension context is still valid
      chrome.runtime.getURL('');
    } catch (error) {
      this.storeAnalyticsLocally(data);
      return;
    }
    
    try {
      chrome.runtime.sendMessage({
        type: 'ANALYTICS',
        data: data
      }, (response) => {
        if (chrome.runtime.lastError) {
          // Store locally if extension context is invalid
          if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
            this.storeAnalyticsLocally(data);
          } else {
            console.warn('⚠️ Error sending analytics:', chrome.runtime.lastError.message);
          }
        }
      });
    } catch (error) {
      // Store locally if extension context is invalid
      if (error.message.includes('Extension context invalidated')) {
        this.storeAnalyticsLocally(data);
      } else {
        console.warn('⚠️ Failed to send analytics:', error.message);
      }
    }
  }
  
  storeAnalyticsLocally(data) {
    try {
      // Store analytics data in localStorage as fallback
      const storedData = JSON.parse(localStorage.getItem('cliffdive_analytics') || '[]');
      storedData.push({
        ...data,
        timestamp: Date.now(),
        stored: true
      });
      
      // Keep only last 100 entries to prevent localStorage overflow
      if (storedData.length > 100) {
        storedData.splice(0, storedData.length - 100);
      }
      
      localStorage.setItem('cliffdive_analytics', JSON.stringify(storedData));
      
      // Try to send stored analytics periodically
      this.trySendStoredAnalytics();
    } catch (error) {
      console.warn('⚠️ Failed to store analytics locally:', error.message);
    }
  }
  
  trySendStoredAnalytics() {
    // Only try once every 30 seconds to avoid spam
    if (this.lastStoredAnalyticsAttempt && Date.now() - this.lastStoredAnalyticsAttempt < 30000) {
      return;
    }
    
    this.lastStoredAnalyticsAttempt = Date.now();
    
    try {
      const storedData = JSON.parse(localStorage.getItem('cliffdive_analytics') || '[]');
      if (storedData.length === 0) return;
      
      // Check if extension context is available
      if (typeof chrome === 'undefined' || !chrome.runtime) return;
      
      try {
        chrome.runtime.getURL('');
      } catch (error) {
        return; // Extension context still invalid
      }
      
      // Send all stored analytics
      storedData.forEach(item => {
        try {
          chrome.runtime.sendMessage({
            type: 'ANALYTICS',
            data: item
          });
        } catch (error) {
          // Ignore errors for stored analytics
        }
      });
      
      // Clear stored data after successful send
      localStorage.removeItem('cliffdive_analytics');
      console.log('✅ Successfully sent stored analytics');
    } catch (error) {
      // Ignore errors for stored analytics
    }
  }
  
  cleanup() {
    // Clean up observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.error('❌ Error disconnecting observer:', error);
      }
    });
    this.observers = [];
  }
}

// Initialize the detector when the script loads
const detector = new AIInteractionDetector();

// Make analytics accessible globally for network interception
window.cliffDiveAnalytics = detector;

// Mark that the content script is loaded
document.documentElement.setAttribute('data-cliffdive-analytics', 'loaded');
console.log('🎯 CliffDive AI Analytics content script loaded with advanced monitoring');

// Try to send stored analytics when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    detector.trySendStoredAnalytics();
  }
});

// Try to send stored analytics periodically
setInterval(() => {
  detector.trySendStoredAnalytics();
}, 60000); // Every minute

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  detector.cleanup();
}); 