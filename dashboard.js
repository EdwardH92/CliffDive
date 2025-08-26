// Dashboard Script for AI Analytics
class Dashboard {
  constructor() {
    this.analyticsData = null;
    this.charts = {};
    this.currentSection = 'overview';
    this.updateTimeout = null;
    this.isDarkMode = false;
    this.currentDateFilter = null; // Track current date filter
    this.isUpdating = false; // Prevent concurrent updates
    this.lastUpdateTime = 0; // Track last update time
    this.isUpdatingCharts = false; // Prevent recursive chart updates
    
    // Ensure body has proper class on load
    if (!document.body.classList.contains('dark-mode') && !document.body.classList.contains('light-mode')) {
      document.body.classList.add('light-mode');
    }
    
    // AI Tools data
    this.aiTools = {
      llm: [
        { name: 'ChatGPT', domain: 'chatgpt.com', url: 'https://chatgpt.com', description: 'OpenAI\'s conversational AI assistant', icon: '🤖', tier: 1 },
        { name: 'Claude', domain: 'claude.ai', url: 'https://claude.ai', description: 'Anthropic\'s AI assistant focused on safety', icon: '🧠', tier: 1 },
        { name: 'Gemini', domain: 'gemini.google.com', url: 'https://gemini.google.com', description: 'Google\'s multimodal AI model', icon: '💎', tier: 1 },
        { name: 'Poe', domain: 'poe.com', url: 'https://poe.com', description: 'Quora\'s AI chat platform with multiple models', icon: '📝', tier: 1 },
        { name: 'Grok', domain: 'grok.x.ai', url: 'https://grok.x.ai', description: 'X/Twitter\'s AI assistant with real-time data', icon: '🚀', tier: 1 },
        { name: 'Microsoft Copilot', domain: 'copilot.microsoft.com', url: 'https://copilot.microsoft.com', description: 'Microsoft\'s AI assistant integrated with Office', icon: '🪖', tier: 2 },
        { name: 'Character.AI', domain: 'character.ai', url: 'https://character.ai', description: 'AI characters for roleplay and conversation', icon: '🎭', tier: 1 },
        { name: 'HuggingChat', domain: 'huggingface.co', url: 'https://huggingface.co/chat', description: 'Open-source AI chat powered by Hugging Face', icon: '🤗', tier: 1 }
      ],
      search: [
        { name: 'Perplexity', domain: 'perplexity.ai', url: 'https://perplexity.ai', description: 'AI-powered search with real-time answers', icon: '🔍', tier: 1 },
        { name: 'Bing Chat', domain: 'bing.com', url: 'https://bing.com/chat', description: 'Microsoft\'s AI-powered search chat', icon: '🔎', tier: 2 },
        { name: 'You.com', domain: 'you.com', url: 'https://you.com', description: 'AI search engine with multiple sources', icon: '👤', tier: 1 },
        { name: 'Phind', domain: 'phind.com', url: 'https://phind.com', description: 'AI search engine for developers', icon: '💻', tier: 1 },
        { name: 'Google Search AI', domain: 'google.com', url: 'https://google.com', description: 'AI-enhanced search features in Google Search', icon: '🔎', tier: 2 }
      ],
      creative: [
        { name: 'Midjourney', domain: 'midjourney.com', url: 'https://midjourney.com', description: 'AI image generation through Discord', icon: '🎨', tier: 1 },
        { name: 'DALL·E', domain: 'openai.com/dall-e', url: 'https://openai.com/dall-e', description: 'OpenAI\'s AI image generation', icon: '🎨', tier: 1 },
        { name: 'Canva', domain: 'canva.com', url: 'https://canva.com', description: 'Design platform with AI-powered features', icon: '🎨', tier: 2 },
        { name: 'Adobe Firefly', domain: 'adobe.com/firefly', url: 'https://adobe.com/firefly', description: 'Adobe\'s AI creative tools suite', icon: '🔥', tier: 2 },
        { name: 'Runway', domain: 'runwayml.com', url: 'https://runwayml.com', description: 'AI video editing and generation platform', icon: '🎬', tier: 1 },
        { name: 'Descript', domain: 'descript.com', url: 'https://descript.com', description: 'AI-powered audio and video editing', icon: '🎧', tier: 2 },
        { name: 'ElevenLabs', domain: 'elevenlabs.io', url: 'https://elevenlabs.io', description: 'AI voice generation and cloning', icon: '🗣️', tier: 1 }
      ],
      writing: [
        { name: 'Jasper', domain: 'jasper.ai', url: 'https://jasper.ai', description: 'AI writing assistant for marketing content', icon: '✍️', tier: 1 },
        { name: 'Grammarly', domain: 'grammarly.com', url: 'https://grammarly.com', description: 'Writing assistant with AI capabilities', icon: '✏️', tier: 2 },
        { name: 'Copy.ai', domain: 'copy.ai', url: 'https://copy.ai', description: 'AI copywriting and content generation', icon: '📄', tier: 1 },
        { name: 'Notion AI', domain: 'notion.so', url: 'https://notion.so', description: 'Note-taking platform with AI features', icon: '📝', tier: 2 },
        { name: 'Microsoft Word AI', domain: 'microsoft.com', url: 'https://microsoft.com/microsoft-365/word', description: 'AI writing features in Microsoft Word', icon: '📎', tier: 2 },
        { name: 'Google Docs AI', domain: 'docs.google.com', url: 'https://docs.google.com', description: 'AI writing features in Google Docs', icon: '📄', tier: 2 }
      ],
      productivity: [
        { name: 'Gamma', domain: 'gamma.app', url: 'https://gamma.app', description: 'AI-powered presentation and document creation', icon: '✨', tier: 1 },
        { name: 'Microsoft 365 Copilot', domain: 'microsoft.com', url: 'https://microsoft.com/microsoft-365/copilot', description: 'AI features across Microsoft 365', icon: '🪖', tier: 2 },
        { name: 'Google Workspace AI', domain: 'workspace.google.com', url: 'https://workspace.google.com', description: 'AI features in Google Workspace', icon: '🔧', tier: 2 },
        { name: 'Tome', domain: 'tome.app', url: 'https://tome.app', description: 'AI storytelling and presentation platform', icon: '📖', tier: 1 }
      ],
      business: [
        { name: 'Salesforce Einstein', domain: 'salesforce.com', url: 'https://salesforce.com/einstein', description: 'AI capabilities in Salesforce', icon: '☁️', tier: 2 },
        { name: 'HubSpot AI', domain: 'hubspot.com', url: 'https://hubspot.com', description: 'AI features in HubSpot platform', icon: '🎯', tier: 2 },
        { name: 'Zendesk AI', domain: 'zendesk.com', url: 'https://zendesk.com', description: 'AI-powered customer service tools', icon: '💬', tier: 2 },
        { name: 'Intercom AI', domain: 'intercom.com', url: 'https://intercom.com', description: 'AI chatbots and customer engagement', icon: '🤝', tier: 2 }
      ],
      seo: [
        { name: 'SurgeGraph', domain: 'surgegraph.com', url: 'https://surgegraph.com', description: 'AI-powered SEO content optimization', icon: '📈', tier: 1 },
        { name: 'Ahrefs AI', domain: 'ahrefs.com', url: 'https://ahrefs.com', description: 'AI-powered SEO tools and analytics', icon: '📊', tier: 2 },
        { name: 'SEMrush AI', domain: 'semrush.com', url: 'https://semrush.com', description: 'AI-enhanced SEO and marketing platform', icon: '🎯', tier: 2 },
        { name: 'Moz AI', domain: 'moz.com', url: 'https://moz.com', description: 'AI features in SEO toolset', icon: '🔍', tier: 2 }
      ]
    };
    
    this.initialize();
  }
  
  setupTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        const tooltip = e.target;
        const rect = tooltip.getBoundingClientRect();
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;
        
        // Remove any existing position classes
        tooltip.classList.remove('tooltip-top', 'tooltip-bottom');
        
        // Add appropriate class based on available space
        if (spaceBelow >= 200 || spaceAbove < 150) {
          tooltip.classList.add('tooltip-bottom');
        } else {
          tooltip.classList.add('tooltip-top');
        }
      });
    });
  }

  initialize() {
    // Initialize dark mode first to ensure proper UI state
    this.initializeDarkMode();
    
    this.setupNavigation();
    this.setupEventListeners();
    this.loadAnalytics();
    this.setupCharts();
    this.loadPrivacySettings();
    
    // Add tooltip initialization
    this.setupTooltips();
    
    // Re-setup tooltips when sections change
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        setTimeout(() => this.setupTooltips(), 100);
      });
    });
    
    // Auto-refresh every 60 seconds (less aggressive)
    setInterval(() => {
      // Auto-refresh when no date filter is active (showing all time)
      if (!this.currentDateFilter) {
        this.loadAnalytics();
      } else {
        console.log('⏸️ Auto-refresh skipped due to active date filter');
      }
    }, 60000);
  }
  
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.showSection(section);
      });
    });
  }
  
  setupEventListeners() {
    // Header actions
    document.getElementById('refreshBtn').addEventListener('click', () => this.loadAnalytics());
    document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
    
    // Date range picker
    document.getElementById('dateRangeSelect').addEventListener('change', (e) => {
      this.handleDateRangeChange(e.target.value);
    });
    
    document.getElementById('startDate').addEventListener('change', () => this.updateDateRange());
    document.getElementById('endDate').addEventListener('change', () => this.updateDateRange());
    
    // Platform filter
    document.getElementById('platformFilter').addEventListener('change', (e) => {
      this.filterPlatforms(e.target.value);
    });
    
    // Trend controls
    document.querySelectorAll('.trend-controls .btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.trend-controls .btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateTrendsChart(e.target.dataset.period);
      });
    });
    
    // Settings
    document.getElementById('workHoursOnly').addEventListener('change', (e) => {
      this.updatePrivacySettings({ workHoursOnly: e.target.checked });
    });
    
    document.getElementById('individualOptOut').addEventListener('change', (e) => {
      this.updatePrivacySettings({ individualOptOut: e.target.checked });
    });
    
    // Work hours input listeners
    document.getElementById('workStart').addEventListener('change', (e) => {
      const hour = parseInt(e.target.value.split(':')[0]);
      this.updatePrivacySettings({ 
        workHours: { 
          ...this.getCurrentWorkHours(), 
          start: hour 
        } 
      });
    });
    
    document.getElementById('workEnd').addEventListener('change', (e) => {
      const hour = parseInt(e.target.value.split(':')[0]);
      this.updatePrivacySettings({ 
        workHours: { 
          ...this.getCurrentWorkHours(), 
          end: hour 
        } 
      });
    });
    
    document.getElementById('exportAllData').addEventListener('click', () => this.exportData());
    document.getElementById('clearData').addEventListener('click', () => this.clearData());
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }
  }
  
  showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
    // Update header
    this.updateHeader(sectionName);
    
    // Update content based on section
    this.currentSection = sectionName;
    
    // Give the DOM time to render the section before initializing/updating charts
    setTimeout(() => {
      // Re-initialize charts if needed
      if ((sectionName === 'trends' || sectionName === 'productivity') && (!this.charts.trends || !this.charts.peakTimes)) {
        this.initializeCharts();
      }
      
      // Update section content and charts
      this.updateSectionContent(sectionName);
      this.updateAllCharts();
    }, 300);
  }
  
  updateHeader(sectionName) {
    const titles = {
      overview: 'Overview',
      platforms: 'Platforms',
      trends: 'Trends',
      productivity: 'Productivity',
      settings: 'Settings'
    };
    
    const descriptions = {
      overview: 'Your AI usage analytics and insights',
      platforms: 'Detailed platform usage breakdown',
      trends: 'Usage patterns over time',
      productivity: 'Productivity insights and optimization',
      settings: 'Privacy controls and data management'
    };
    
    document.getElementById('sectionTitle').textContent = titles[sectionName];
    document.getElementById('sectionDescription').textContent = descriptions[sectionName];
  }
  
  async loadAnalytics() {
    // Prevent concurrent updates
    if (this.isUpdating) {
      console.log('⏳ Update already in progress, skipping...');
      return;
    }
    
    // Debounce rapid calls
    const now = Date.now();
    if (now - this.lastUpdateTime < 1000) { // 1 second debounce
      console.log('⏳ Debouncing rapid update calls...');
      return;
    }
    
    this.isUpdating = true;
    this.lastUpdateTime = now;
    
    try {
      console.log('🔄 Dashboard loading analytics...');
      const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      console.log('📊 Dashboard received analytics:', response);
      
      if (response) {
        this.analyticsData = response;
        
        // Debug: Log basic data info
        console.log(`📊 Loaded ${response.sessions?.length || 0} sessions, ${Object.keys(response.dailyStats || {}).length} days of stats`);
        
        // Log data details for debugging
        if (response.platformUsage) {
          const platformCount = Object.keys(response.platformUsage).length;
          console.log(`📈 Found ${platformCount} platforms in analytics`);
        }
        
        if (response.dailyStats) {
          const dayCount = Object.keys(response.dailyStats).length;
          console.log(`📅 Found ${dayCount} days in daily stats`);
          console.log('📅 Daily stats keys:', Object.keys(response.dailyStats));
        }
        
        if (response.activeSessions) {
          console.log(`🔄 Found ${response.activeSessions.length} active sessions`);
        }
        
        // Reapply current date filter if one is active
        if (this.currentDateFilter) {
          console.log('📅 Reapplying date filter after data reload');
          this.applyDateFilter(this.currentDateFilter);
        } else {
          this.updateDashboard();
        }
        
        console.log('✅ Dashboard updated with new data');
      } else {
        console.log('⚠️ No analytics data received');
      }
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
    } finally {
      this.isUpdating = false;
    }
  }
  
  updateDashboardWithData(data) {
    // Update the analytics data with filtered data
    this.analyticsData = {
      ...this.analyticsData,
      sessions: data.sessions,
      totalSessions: data.totalSessions,
      totalTime: data.totalTime,
      messagesSent: data.messagesSent,
      messagesReceived: data.messagesReceived,
      platformsUsed: data.platformsUsed
    };
    
    // Update dashboard display
    this.updateDashboard();
  }

  updateDashboard() {
    if (!this.analyticsData) return;
    
    // Destroy existing charts before recreating
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        try {
          chart.destroy();
        } catch (error) {
          console.warn('⚠️ Error destroying chart:', error);
        }
      }
    });
    
    // Clear charts object
    this.charts = {};
    
    // Update all sections
    this.updateOverviewStats();
    this.updatePlatformsSection();
    this.updateTrendsSection();
    this.updateProductivitySection();
    this.updateAIToolsSection();
    this.updateRecentActivity();
    
    // Reinitialize charts
    this.initializeCharts();
    
    // Update charts with data after initialization
    setTimeout(() => {
      this.updateAllCharts();
    }, 100);
  }
  
  updateOverviewStats() {
    if (!this.analyticsData) return;
    
    const today = new Date().toISOString().split('T')[0];
    const todayStats = (this.analyticsData.dailyStats && this.analyticsData.dailyStats[today]) || {
      totalSessions: 0,
      totalTime: 0,
      messagesSent: 0,
      messagesReceived: 0
    };
    
    // Calculate totals from dailyStats first, fallback to platformUsage if dailyStats is empty
    const dailyStats = this.analyticsData.dailyStats || {};
    const platformUsage = this.analyticsData.platformUsage || {};
    
    let totalSessions = Object.values(dailyStats).reduce((sum, day) => sum + (day.totalSessions || 0), 0);
    let totalTime = Object.values(dailyStats).reduce((sum, day) => sum + (day.totalTime || 0), 0);
    let totalMessagesSent = Object.values(dailyStats).reduce((sum, day) => sum + (day.messagesSent || 0), 0);
    let totalMessagesReceived = Object.values(dailyStats).reduce((sum, day) => sum + (day.messagesReceived || 0), 0);
    
    // If dailyStats is empty but platformUsage has data, calculate from platformUsage
    if (totalSessions === 0 && Object.keys(platformUsage).length > 0) {
      console.log('📊 Using platformUsage data for overview stats (dailyStats is empty)');
      totalSessions = Object.values(platformUsage).reduce((sum, platform) => sum + (platform.totalSessions || 0), 0);
      totalTime = Object.values(platformUsage).reduce((sum, platform) => sum + (platform.totalTime || 0), 0);
      totalMessagesSent = Object.values(platformUsage).reduce((sum, platform) => sum + (platform.messagesSent || 0), 0);
      totalMessagesReceived = Object.values(platformUsage).reduce((sum, platform) => sum + (platform.messagesReceived || 0), 0);
    }
    
    const avgSession = totalSessions > 0 ? Math.round(totalTime / totalSessions / (1000 * 60)) : 0;
    
    console.log('📊 Overview stats calculated:', {
      totalSessions,
      totalTime,
      totalMessagesSent,
      totalMessagesReceived,
      avgSession,
      dailyStatsKeys: Object.keys(dailyStats),
      platformUsageKeys: Object.keys(platformUsage)
    });
    
    // Calculate week-over-week changes
    const weekChanges = this.calculateWeekOverWeekChanges();
    
    // Update stats
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('totalTime').textContent = this.formatDuration(totalTime);
    document.getElementById('messagesSent').textContent = totalMessagesSent;
    document.getElementById('messagesReceived').textContent = totalMessagesReceived;
    document.getElementById('avgSession').textContent = `${avgSession}m`;
    
    // Update change indicators
    this.updateChangeIndicator('sessionsChange', weekChanges.sessions);
    this.updateChangeIndicator('timeChange', weekChanges.time);
    this.updateChangeIndicator('messagesSentChange', weekChanges.messagesSent);
    this.updateChangeIndicator('messagesReceivedChange', weekChanges.messagesReceived);
    this.updateChangeIndicator('avgSessionChange', weekChanges.avgSession);
  }
  
  calculateWeekOverWeekChanges() {
    const dailyStats = this.analyticsData.dailyStats || {};
    const today = new Date();
    
    // Get current week data (last 7 days)
    const currentWeekData = this.getLastNDays(7).map(date => dailyStats[date] || { 
      totalSessions: 0, 
      totalTime: 0, 
      messagesSent: 0, 
      messagesReceived: 0 
    });
    
    // Get previous week data (7 days before that)
    const previousWeekStart = new Date(today);
    previousWeekStart.setDate(today.getDate() - 14);
    const previousWeekEnd = new Date(today);
    previousWeekEnd.setDate(today.getDate() - 7);
    
    const previousWeekDates = [];
    for (let d = new Date(previousWeekStart); d <= previousWeekEnd; d.setDate(d.getDate() + 1)) {
      previousWeekDates.push(d.toISOString().split('T')[0]);
    }
    
    const previousWeekData = previousWeekDates.map(date => dailyStats[date] || { 
      totalSessions: 0, 
      totalTime: 0, 
      messagesSent: 0, 
      messagesReceived: 0 
    });
    
    // Calculate totals for each week
    const currentWeekSessions = currentWeekData.reduce((sum, day) => sum + (day.totalSessions || 0), 0);
    const currentWeekTime = currentWeekData.reduce((sum, day) => sum + (day.totalTime || 0), 0);
    const currentWeekMessagesSent = currentWeekData.reduce((sum, day) => sum + (day.messagesSent || 0), 0);
    const currentWeekMessagesReceived = currentWeekData.reduce((sum, day) => sum + (day.messagesReceived || 0), 0);
    
    const previousWeekSessions = previousWeekData.reduce((sum, day) => sum + (day.totalSessions || 0), 0);
    const previousWeekTime = previousWeekData.reduce((sum, day) => sum + (day.totalTime || 0), 0);
    const previousWeekMessagesSent = previousWeekData.reduce((sum, day) => sum + (day.messagesSent || 0), 0);
    const previousWeekMessagesReceived = previousWeekData.reduce((sum, day) => sum + (day.messagesReceived || 0), 0);
    
    // Calculate percentages
    const sessionsChange = this.calculatePercentageChange(previousWeekSessions, currentWeekSessions);
    const timeChange = this.calculatePercentageChange(previousWeekTime, currentWeekTime);
    const messagesSentChange = this.calculatePercentageChange(previousWeekMessagesSent, currentWeekMessagesSent);
    const messagesReceivedChange = this.calculatePercentageChange(previousWeekMessagesReceived, currentWeekMessagesReceived);
    
    // Calculate average session time changes
    const currentAvgSession = currentWeekSessions > 0 ? currentWeekTime / currentWeekSessions : 0;
    const previousAvgSession = previousWeekSessions > 0 ? previousWeekTime / previousWeekSessions : 0;
    const avgSessionChange = this.calculatePercentageChange(previousAvgSession, currentAvgSession);
    
    return {
      sessions: sessionsChange,
      time: timeChange,
      messagesSent: messagesSentChange,
      messagesReceived: messagesReceivedChange,
      avgSession: avgSessionChange
    };
  }
  
  calculatePercentageChange(previous, current) {
    if (previous === 0) {
      return current > 0 ? { value: 100, type: 'increase', text: 'New data' } : { value: 0, type: 'neutral', text: 'No data yet' };
    }
    
    const change = ((current - previous) / previous) * 100;
    const roundedChange = Math.round(change);
    
    if (roundedChange > 0) {
      return { value: roundedChange, type: 'increase', text: `+${roundedChange}% vs last week` };
    } else if (roundedChange < 0) {
      return { value: Math.abs(roundedChange), type: 'decrease', text: `${roundedChange}% vs last week` };
    } else {
      return { value: 0, type: 'neutral', text: 'No change' };
    }
  }
  
  updateChangeIndicator(elementId, change) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = change.text;
    element.className = `stat-change ${change.type}`;
  }
  
  updatePlatformsSection() {
    if (!this.analyticsData) return;
    
    const platformsGrid = document.getElementById('platformsGrid');
    const platforms = Object.entries(this.analyticsData.platformUsage || {});
    
    if (platforms.length === 0) {
      platformsGrid.innerHTML = '<div class="no-data">No platform usage data available</div>';
      return;
    }
    
    platformsGrid.innerHTML = platforms.map(([name, stats]) => {
      const minutes = Math.round(stats.totalTime / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const timeDisplay = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
      
      const icon = this.getToolIcon(name) || '🔧';
      const tier = this.getPlatformType(name);
      const avgSessionTime = stats.totalSessions > 0 ? Math.round(stats.totalTime / stats.totalSessions / (1000 * 60)) : 0;
      
      return `
        <div class="tool-card platform-card">
          <div class="tool-header">
            <div class="tool-icon">${icon}</div>
            <div>
              <div class="tool-name">${name}</div>
              <div class="tool-domain">${avgSessionTime}m avg session</div>
            </div>
          </div>
          
          <div class="tool-metrics">
            <div class="metric">
              <div class="metric-label">Sessions</div>
              <div class="metric-value">${stats.totalSessions}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Time</div>
              <div class="metric-value">${timeDisplay}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Messages</div>
              <div class="metric-value">${stats.totalMessages || 0}</div>
            </div>
          </div>

          <div class="tool-status-row">
            <div class="tool-status tracked">
              Last used: ${stats.lastUsed ? this.formatDate(stats.lastUsed) : 'Never'}
            </div>
            <div class="tool-tier tier-${tier === 'Tier 1' ? '1' : '2'}" data-tooltip="${tier === 'Tier 1' ? 'Dedicated AI-only tools' : 'AI features within general productivity tools'}">
              ${tier}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  updateTrendsSection() {
    if (!this.analyticsData) return;
    
    // Don't update chart here - will be done in updateAllCharts()
  }
  
  updateProductivitySection() {
    if (!this.analyticsData) return;
    
    // Don't update charts here - will be done in updateAllCharts()
    this.updateEfficiencyList();
  }
  
  updateAIToolsSection() {
    // Get tracked platforms from analytics data
    const trackedPlatforms = this.analyticsData?.platformUsage ? Object.keys(this.analyticsData.platformUsage) : [];
    
    // Populate each category
    Object.keys(this.aiTools).forEach(category => {
      const container = document.getElementById(`${category}-tools`);
      if (!container) return;
      
      const tools = this.aiTools[category];
      container.innerHTML = tools.map(tool => {
        const isTracked = trackedPlatforms.some(platform => 
          platform.toLowerCase().includes(tool.name.toLowerCase()) ||
          platform.toLowerCase().includes(tool.domain.toLowerCase())
        );
        
        return `
          <a href="${tool.url}" target="_blank" class="tool-card">
            <div class="tool-header">
              <div class="tool-icon">${tool.icon}</div>
              <div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-domain">${tool.domain}</div>
              </div>
            </div>
            <div class="tool-description">${tool.description}</div>
            <div class="tool-status-row">
              <div class="tool-status ${isTracked ? 'tracked' : 'untracked'}">
                ${isTracked ? '✅ Tracked' : '⏳ Not Tracked'}
              </div>
              <div class="tool-tier tier-${tool.tier || 1}" data-tooltip="${tool.tier === 2 ? 'AI features within general productivity tools' : 'Dedicated AI-only tools'}">
                Tier ${tool.tier || 1}
              </div>
            </div>
          </a>
        `;
      }).join('');
    });
    
    // Show admin section if user has admin privileges (future feature)
    // For now, hide it
    const adminSection = document.getElementById('adminSection');
    if (adminSection) {
      adminSection.style.display = 'none';
    }
  }
  
  updateRecentActivity() {
    if (!this.analyticsData) return;
    
    const recentActivity = document.getElementById('recentActivity');
    const sessions = this.analyticsData.sessions ? this.analyticsData.sessions.slice(-10).reverse() : []; // Last 10 sessions
    
    if (sessions.length === 0) {
      recentActivity.innerHTML = '<div class="no-data">No recent activity</div>';
      return;
    }
    
          recentActivity.innerHTML = sessions.map(session => {
        const duration = this.formatDuration(session.timeSpent);
        const time = this.formatTime(session.startTime);
        const icon = this.getToolIcon(session.platform.name) || '🔧';
        
        return `
          <div class="activity-card">
            <div class="activity-content">
              <div class="activity-icon">${icon}</div>
              <div class="activity-details">
                <div class="activity-platform">${session.platform.name}</div>
                <div class="activity-stats">${duration} • ${session.interactions} interactions</div>
              </div>
            </div>
            <div class="activity-time">${time}</div>
          </div>
        `;
      }).join('');
  }
  
  setupCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('❌ Chart.js not loaded. Charts will not be available.');
      return;
    }
    
    // Initialize charts immediately for the overview section
    this.initializeCharts();
    
    // Set up a mutation observer to watch for section changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const section = mutation.target;
          if (section.classList.contains('active')) {
            // Re-initialize charts when section becomes active
            setTimeout(() => {
              this.initializeCharts();
              this.updateAllCharts();
            }, 300);
          }
        }
      });
    });
    
    // Observe all sections for class changes
    document.querySelectorAll('.content-section').forEach(section => {
      observer.observe(section, { attributes: true });
    });
  }
  
  initializeCharts() {
    if (!this.analyticsData) return;
    
    const textColor = this.isDarkMode ? '#e1e5e9' : '#1f2937';
    const gridColor = this.isDarkMode ? '#404040' : '#e5e7eb';
    
    // Destroy existing charts first to prevent canvas reuse errors
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        try {
          chart.destroy();
        } catch (error) {
          console.warn('⚠️ Error destroying chart:', error);
        }
      }
    });
    
    // Clear charts object
    this.charts = {};
    
    // Initialize Usage Over Time chart
    if (this.isChartContainerValid('trendsChart')) {
      try {
        const ctx = document.getElementById('trendsChart').getContext('2d');
        this.charts.trends = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Sessions',
              data: [],
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4
            }, {
              label: 'Time (minutes)',
              data: [],
              borderColor: '#f093fb',
              backgroundColor: 'rgba(240, 147, 251, 0.1)',
              tension: 0.4,
              yAxisID: 'y1'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                  color: textColor,
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              }
            },
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: gridColor },
                ticks: { color: textColor }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: { color: textColor }
              }
            }
          }
        });
      } catch (error) {
        console.error('❌ Error creating trends chart:', error);
      }
    }
    
    // Initialize Peak Usage Times chart
    if (this.isChartContainerValid('peakTimesChart')) {
      try {
        const ctx = document.getElementById('peakTimesChart').getContext('2d');
        this.charts.peakTimes = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
              label: 'Sessions',
              data: [12, 25, 18, 22, 15, 8],
              backgroundColor: 'rgba(102, 126, 234, 0.8)',
              borderColor: '#667eea',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor }
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: textColor }
              }
            }
          }
        });
      } catch (error) {
        console.error('❌ Error creating peak times chart:', error);
      }
    }
    
    // Initialize Session Patterns chart
    if (this.isChartContainerValid('sessionPatternsChart')) {
      try {
        const ctx = document.getElementById('sessionPatternsChart').getContext('2d');
        this.charts.sessionPatterns = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Short (< 5 min)', 'Medium (5-15 min)', 'Long (> 15 min)'],
            datasets: [{
              data: [30, 45, 25],
              backgroundColor: ['#667eea', '#f093fb', '#4facfe'],
              borderWidth: 2,
              borderColor: this.isDarkMode ? '#2d2d2d' : '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      } catch (error) {
        console.error('❌ Error creating session patterns chart:', error);
      }
    }
    
    // Initialize Platform Usage chart
    if (this.isChartContainerValid('platformChart')) {
      try {
        const ctx = document.getElementById('platformChart').getContext('2d');
        this.charts.platformChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [
                '#667eea', '#f093fb', '#4facfe', '#43e97b', '#38f9d7',
                '#fa709a', '#fee140', '#a8edea', '#fed6e3', '#a8caba'
              ],
              borderWidth: 2,
              borderColor: this.isDarkMode ? '#2d2d2d' : '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                  color: textColor,
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('❌ Error creating platform chart:', error);
      }
    }
    
    // Initialize Daily Activity chart
    if (this.isChartContainerValid('activityChart')) {
      try {
        const ctx = document.getElementById('activityChart').getContext('2d');
        this.charts.activity = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Time Spent (minutes)',
              data: [],
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                  color: textColor,
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              }
            },
            scales: {
              x: {
                grid: { color: gridColor },
                ticks: { color: textColor }
              },
              y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: { color: textColor }
              }
            }
          }
        });
      } catch (error) {
        console.error('❌ Error creating activity chart:', error);
      }
    }
    
    // Don't call updateAllCharts here to prevent infinite recursion
    // Charts will be updated separately when data is loaded
  }
  
  updatePlatformChart() {
    if (!this.analyticsData || !this.charts.platformChart || typeof Chart === 'undefined') return;
    
    const chartContainer = document.getElementById('platformChart');
    if (!chartContainer || chartContainer.offsetWidth === 0 || chartContainer.offsetHeight === 0) return;
    
    const platforms = Object.entries(this.analyticsData.platformUsage || {})
      .sort(([,a], [,b]) => b.totalTime - a.totalTime)
      .slice(0, 8);
    
    this.charts.platformChart.data.labels = platforms.map(([name]) => name);
    this.charts.platformChart.data.datasets[0].data = platforms.map(([,stats]) => 
      Math.round(stats.totalTime / (1000 * 60))
    );
    this.charts.platformChart.update('none'); // Disable animations
  }
  
  updateActivityChart() {
    if (!this.analyticsData || !this.charts.activity || typeof Chart === 'undefined') return;
    
    const chartContainer = document.getElementById('activityChart');
    if (!chartContainer || chartContainer.offsetWidth === 0 || chartContainer.offsetHeight === 0) return;
    
    const last7Days = this.getLastNDays(7);
    const data = last7Days.map(date => {
      const dayStats = (this.analyticsData.dailyStats && this.analyticsData.dailyStats[date]) || { totalTime: 0 };
      return Math.round(dayStats.totalTime / (1000 * 60));
    });
    
    this.charts.activity.data.labels = last7Days.map(date => this.formatDate(date));
    this.charts.activity.data.datasets[0].data = data;
    this.charts.activity.update('none'); // Disable animations
  }
  
  updateTrendsChart(period) {
    if (!this.analyticsData || !this.charts.trends || typeof Chart === 'undefined') return;
    
    const days = period === '7d' ? 7 : period === '10d' ? 10 : period === '30d' ? 30 : 10;
    const dates = this.getLastNDays(days);
    
    const sessionsData = dates.map(date => {
      const dayStats = (this.analyticsData.dailyStats && this.analyticsData.dailyStats[date]) || { totalSessions: 0 };
      return dayStats.totalSessions;
    });
    
    const timeData = dates.map(date => {
      const dayStats = (this.analyticsData.dailyStats && this.analyticsData.dailyStats[date]) || { totalTime: 0 };
      return Math.round(dayStats.totalTime / (1000 * 60)); // Convert to minutes
    });
    
    this.charts.trends.data.labels = dates.map(date => this.formatDate(date));
    this.charts.trends.data.datasets[0].data = sessionsData;
    this.charts.trends.data.datasets[1].data = timeData;
    this.charts.trends.update('none'); // Disable animations
  }
  
  updatePeakTimesChart() {
    if (!this.analyticsData || !this.charts.peakTimes || typeof Chart === 'undefined') return;
    
    // Calculate real peak times from session data
    const sessions = this.analyticsData.sessions || [];
    const hourlyUsage = new Array(24).fill(0);
    
    sessions.forEach(session => {
      if (session.startTime) {
        const startHour = new Date(session.startTime).getHours();
        hourlyUsage[startHour]++;
      }
    });
    
    // Use real data or show empty if no sessions
    const peakData = sessions.length > 0 ? hourlyUsage : new Array(24).fill(0);
    
    this.charts.peakTimes.data.datasets[0].data = peakData;
    this.charts.peakTimes.update('none'); // Disable animations
  }
  
  updateSessionPatternsChart() {
    if (!this.analyticsData || !this.charts.sessionPatterns) return;
    
    const sessions = this.analyticsData.sessions || [];
    const patterns = [0, 0, 0, 0, 0]; // 0-5m, 5-15m, 15-30m, 30-60m, 60m+
    
    sessions.forEach(session => {
      const minutes = session.timeSpent / (1000 * 60);
      if (minutes <= 5) patterns[0]++;
      else if (minutes <= 15) patterns[1]++;
      else if (minutes <= 30) patterns[2]++;
      else if (minutes <= 60) patterns[3]++;
      else patterns[4]++;
    });
    
    this.charts.sessionPatterns.data.datasets[0].data = patterns;
    this.charts.sessionPatterns.update('none'); // Disable animations
  }
  
  updateAllCharts() {
    // Prevent recursive calls
    if (this.isUpdatingCharts) return;
    
    // Update all charts in a controlled manner
    if (!this.analyticsData || typeof Chart === 'undefined') return;
    
    // Don't update if dashboard is not visible
    if (document.hidden || !this.isDashboardVisible()) return;
    
    this.isUpdatingCharts = true;
    
    // Clear any pending update
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    // Debounce chart updates to prevent rapid successive calls
    this.updateTimeout = setTimeout(() => {
      try {
        console.log('🔄 Updating charts...');
        console.log('📊 Available charts:', Object.keys(this.charts));
        
        // Only update charts if they exist and have valid containers with proper dimensions
        if (this.charts.platformChart && this.isChartContainerValid('platformChart')) {
          console.log('✅ Updating platform chart');
          this.updatePlatformChart();
        } else {
          console.log('⚠️ Platform chart not available or container invalid');
        }
        
        if (this.charts.activity && this.isChartContainerValid('activityChart')) {
          console.log('✅ Updating activity chart');
          this.updateActivityChart();
        } else {
          console.log('⚠️ Activity chart not available or container invalid');
        }
        
        if (this.charts.trends && this.isChartContainerValid('trendsChart')) {
          console.log('✅ Updating trends chart');
          this.updateTrendsChart('10d');
        } else {
          console.log('⚠️ Trends chart not available or container invalid');
        }
        
        if (this.charts.peakTimes && this.isChartContainerValid('peakTimesChart')) {
          console.log('✅ Updating peak times chart');
          this.updatePeakTimesChart();
        } else {
          console.log('⚠️ Peak times chart not available or container invalid');
        }
        
        if (this.charts.sessionPatterns && this.isChartContainerValid('sessionPatternsChart')) {
          console.log('✅ Updating session patterns chart');
          this.updateSessionPatternsChart();
        } else {
          console.log('⚠️ Session patterns chart not available or container invalid');
        }
        
        console.log('✅ Chart updates completed');
      } catch (error) {
        console.error('❌ Error updating charts:', error);
      } finally {
        this.updateTimeout = null;
        this.isUpdatingCharts = false;
      }
    }, 300);
  }
  
  isDashboardVisible() {
    const dashboard = document.querySelector('.dashboard-container');
    if (!dashboard) return false;
    
    const rect = dashboard.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  isChartContainerValid(containerId) {
    const container = document.getElementById(containerId);
    return container && container.offsetWidth > 0 && container.offsetHeight > 0;
  }
  
  updateEfficiencyList() {
    if (!this.analyticsData) return;
    
    const efficiencyList = document.getElementById('efficiencyList');
    const platforms = Object.entries(this.analyticsData.platformUsage || {});
    
    if (platforms.length === 0) {
      efficiencyList.innerHTML = '<div class="no-data">No efficiency data available</div>';
      return;
    }
    
    const efficiencyData = platforms.map(([name, stats]) => {
      // Calculate real efficiency metrics based on actual usage patterns
      const avgSessionTime = stats.totalSessions > 0 ? stats.totalTime / stats.totalSessions / (1000 * 60) : 0;
      const avgMessagesPerSession = stats.totalSessions > 0 ? stats.totalMessages / stats.totalSessions : 0;
      const totalHours = stats.totalTime / (1000 * 60 * 60);
      
      // Real efficiency calculation based on multiple factors
      let efficiency = 0;
      
      if (stats.totalSessions > 0) {
        // Factor 1: Session productivity (messages per session)
        const messageEfficiency = Math.min(100, (avgMessagesPerSession / 5) * 100); // 5+ messages per session is considered productive
        
        // Factor 2: Time efficiency (shorter sessions can be more focused)
        const timeEfficiency = Math.max(0, 100 - (avgSessionTime / 30) * 100); // 30+ minute sessions get penalized
        
        // Factor 3: Consistency (more sessions indicate regular usage)
        const consistencyEfficiency = Math.min(100, (stats.totalSessions / 10) * 100); // 10+ sessions is considered consistent
        
        // Weighted average of all factors
        efficiency = (messageEfficiency * 0.4 + timeEfficiency * 0.3 + consistencyEfficiency * 0.3);
      }
      
      // Ensure efficiency is between 0-100
      efficiency = Math.min(100, Math.max(0, Math.round(efficiency)));
      
      return `
        <div class="efficiency-item">
          <div class="efficiency-header">
            <span class="platform-name">${name}</span>
            <span class="efficiency-score">${efficiency}%</span>
          </div>
          <div class="efficiency-bar">
            <div class="efficiency-fill" style="width: ${efficiency}%"></div>
          </div>
          <div class="efficiency-details">
            <small>${stats.totalSessions} sessions • ${Math.round(avgSessionTime)}m avg • ${Math.round(avgMessagesPerSession)} msgs/session</small>
          </div>
        </div>
      `;
    }).join('');
    
    efficiencyList.innerHTML = efficiencyData;
  }
  
  updateSectionContent(sectionName) {
    switch (sectionName) {
      case 'overview':
        this.updateOverviewStats();
        this.updateRecentActivity();
        break;
      case 'platforms':
        this.updatePlatformsSection();
        break;
      case 'ai-tools':
        this.updateAIToolsSection();
        break;
      case 'trends':
        this.updateTrendsSection();
        break;
      case 'productivity':
        this.updateProductivitySection();
        break;
    }
  }
  
  async loadPrivacySettings() {
    try {
      console.log('🔍 Loading privacy settings...');
      const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      console.log('📊 Analytics response for privacy settings:', response);
      
      if (response && response.privacySettings) {
        const settings = response.privacySettings;
        console.log('⚙️ Privacy settings received:', settings);
        
        // Update UI elements with saved settings
        const workHoursOnlyCheckbox = document.getElementById('workHoursOnly');
        const individualOptOutCheckbox = document.getElementById('individualOptOut');
        const workStartInput = document.getElementById('workStart');
        const workEndInput = document.getElementById('workEnd');
        
        if (workHoursOnlyCheckbox) {
          workHoursOnlyCheckbox.checked = settings.workHoursOnly;
          console.log(`🔧 Set workHoursOnly checkbox to: ${settings.workHoursOnly}`);
        }
        
        if (individualOptOutCheckbox) {
          individualOptOutCheckbox.checked = settings.individualOptOut;
          console.log(`🔧 Set individualOptOut checkbox to: ${settings.individualOptOut}`);
        }
        
        if (workStartInput && settings.workHours) {
          const startHour = settings.workHours.start.toString().padStart(2, '0');
          workStartInput.value = `${startHour}:00`;
          console.log(`🔧 Set work start time to: ${startHour}:00`);
        }
        
        if (workEndInput && settings.workHours) {
          const endHour = settings.workHours.end.toString().padStart(2, '0');
          workEndInput.value = `${endHour}:00`;
          console.log(`🔧 Set work end time to: ${endHour}:00`);
        }
        
        console.log('✅ Privacy settings loaded and applied to UI');
      } else {
        console.log('⚠️ No privacy settings found in response');
      }
    } catch (error) {
      console.error('❌ Error loading privacy settings:', error);
    }
  }
  
  async updatePrivacySettings(settings) {
    try {
      console.log('🔄 Updating privacy settings:', settings);
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_PRIVACY_SETTINGS',
        settings: settings
      });
      console.log('✅ Privacy settings update response:', response);
      
      // Reload privacy settings to confirm they were saved
      setTimeout(() => {
        this.loadPrivacySettings();
      }, 500);
    } catch (error) {
      console.error('❌ Error updating privacy settings:', error);
    }
  }
  
  getCurrentWorkHours() {
    const workStartInput = document.getElementById('workStart');
    const workEndInput = document.getElementById('workEnd');
    
    const startHour = workStartInput ? parseInt(workStartInput.value.split(':')[0]) : 9;
    const endHour = workEndInput ? parseInt(workEndInput.value.split(':')[0]) : 17;
    
    return { start: startHour, end: endHour };
  }
  
  async exportData() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
      if (!response) return;

      // Check if jsPDF is available
      if (typeof window.jsPDF === 'undefined') {
        console.error('jsPDF library not loaded');
        alert('Unable to generate PDF. Downloading JSON data only.');
        this.exportJSON(response);
        return;
      }

      // Create PDF document
      const doc = new window.jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('AI Analytics Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
      
      let yPos = 50;
      
      // Overview Section
      doc.setFontSize(16);
      doc.text('Overview', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      const totalSessions = Object.values(response.platformUsage || {}).reduce((sum, p) => sum + (p.totalSessions || 0), 0);
      const totalTime = Object.values(response.platformUsage || {}).reduce((sum, p) => sum + (p.totalTime || 0), 0);
      const totalMessages = Object.values(response.platformUsage || {}).reduce((sum, p) => sum + (p.totalMessages || 0), 0);
      
      doc.text(`Total Sessions: ${totalSessions}`, 20, yPos);
      yPos += 10;
      doc.text(`Total Time: ${this.formatDuration(totalTime)}`, 20, yPos);
      yPos += 10;
      doc.text(`Total Messages: ${totalMessages}`, 20, yPos);
      yPos += 20;
      
      // Platform Usage Section
      doc.setFontSize(16);
      doc.text('Platform Usage', 20, yPos);
      yPos += 10;
      
      // Create platform usage table
      const platformData = Object.entries(response.platformUsage || {}).map(([name, stats]) => [
        name,
        stats.totalSessions.toString(),
        this.formatDuration(stats.totalTime),
        stats.totalMessages.toString(),
        this.formatDate(stats.lastUsed)
      ]);
      
      try {
        doc.autoTable({
          startY: yPos,
          head: [['Platform', 'Sessions', 'Time Spent', 'Messages', 'Last Used']],
          body: platformData,
          margin: { top: 20, right: 20, bottom: 20, left: 20 },
          headStyles: { fillColor: [102, 126, 234] },
          alternateRowStyles: { fillColor: [245, 247, 250] }
        });
      } catch (error) {
        console.error('Error creating platform usage table:', error);
      }
      
      yPos = doc.lastAutoTable.finalY + 20;
      
      // Recent Activity Section
      if (response.sessions && response.sessions.length > 0) {
        doc.setFontSize(16);
        doc.text('Recent Activity', 20, yPos);
        yPos += 10;
        
        const recentSessions = response.sessions.slice(-10).reverse();
        const recentData = recentSessions.map(session => [
          session.platform.name,
          this.formatDuration(session.timeSpent),
          session.interactions.toString(),
          this.formatTime(session.startTime)
        ]);
        
        try {
          doc.autoTable({
            startY: yPos,
            head: [['Platform', 'Duration', 'Interactions', 'Time']],
            body: recentData,
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
            headStyles: { fillColor: [102, 126, 234] },
            alternateRowStyles: { fillColor: [245, 247, 250] }
          });
        } catch (error) {
          console.error('Error creating recent activity table:', error);
        }
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      try {
        // Save the PDF
        doc.save(`ai-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('✅ PDF report generated successfully');
      } catch (error) {
        console.error('Error saving PDF:', error);
        alert('Unable to generate PDF. Downloading JSON data only.');
      }
      
      // Also provide JSON download option
      this.exportJSON(response);
      
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }
  
  exportJSON(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async clearData() {
    if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      try {
        console.log('🗑️ Clearing all analytics data...');
        
        // Test if chrome.runtime is available
        if (typeof chrome === 'undefined' || !chrome.runtime) {
          throw new Error('Chrome runtime not available');
        }
        
        // Send message to background script to clear data
        const response = await chrome.runtime.sendMessage({ type: 'CLEAR_DATA' });
        
        console.log('📤 Clear data response:', response);
        
        if (response && response.success) {
          // Reset in-memory data
          this.analyticsData = {
            platformUsage: {},
            dailyStats: {},
            sessions: [],
            activeSessions: [],
            privacySettings: {
              workHoursOnly: false,
              individualOptOut: false,
              workHours: { start: 9, end: 17 }
            }
          };
          
          // Clear current date filter
          this.currentDateFilter = null;
          
          // Reset date inputs
          const startInput = document.getElementById('startDate');
          const endInput = document.getElementById('endDate');
          const dateRangeSelect = document.getElementById('dateRangeSelect');
          
          if (startInput) startInput.value = '';
          if (endInput) endInput.value = '';
          if (dateRangeSelect) dateRangeSelect.value = '';
          
          // Update the dashboard with empty data
          this.updateDashboard();
          
          console.log('✅ All data cleared successfully');
          
          // Show confirmation message
          alert('All analytics data has been cleared successfully.');
        } else {
          throw new Error(response?.error || 'Failed to clear data in background script');
        }
        
      } catch (error) {
        console.error('❌ Error clearing data:', error);
        alert(`Error clearing data: ${error.message}. Please reload the extension and try again.`);
      }
    }
  }

  handleDateRangeChange(range) {
    const customDateRange = document.getElementById('customDateRange');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (range === 'custom') {
      customDateRange.style.display = 'flex';
      this.currentDateFilter = null; // Clear filter for custom mode
      return;
    } else {
      customDateRange.style.display = 'none';
    }
    

    
    const today = new Date();
    let startDate, endDate;
    
    switch (range) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case 'this-week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        endDate = new Date(today);
        break;
      case 'last-week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'last-month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }
    
    // Set the date inputs
    startDateInput.value = startDate.toISOString().split('T')[0];
    endDateInput.value = endDate.toISOString().split('T')[0];
    
    // Store the current filter
    this.currentDateFilter = {
      type: 'range',
      startDate: startDateInput.value,
      endDate: endDateInput.value
    };
    
    console.log(`📅 Applying date filter: ${range} (${startDateInput.value} to ${endDateInput.value})`);
    
    // Update the dashboard with the new date range
    this.updateDateRange();
  }

  clearDateFilter() {
    this.currentDateFilter = null;
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    startInput.value = '';
    endInput.value = '';
    document.getElementById('dateRangeSelect').value = '';
    this.loadAnalytics();
  }

  applyDateFilter(filter) {
    if (!filter) {
      this.updateDashboard();
      return;
    }
    
    if (filter.type === 'range') {
      const startInput = document.getElementById('startDate');
      const endInput = document.getElementById('endDate');
      
      startInput.value = filter.startDate;
      endInput.value = filter.endDate;
      
      this.updateDateRange();
    }
  }

  updateDateRange() {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    
    if (!startInput.value || !endInput.value) {
      this.currentDateFilter = null;
      this.loadAnalytics();
      return;
    }
    
    console.log(`📅 Filtering ${this.analyticsData?.sessions?.length || 0} sessions from ${startInput.value} to ${endInput.value}`);
    
    const startDate = new Date(startInput.value + 'T00:00:00');
    const endDate = new Date(endInput.value + 'T23:59:59.999');
    
    // Filter sessions by date range
    const filteredSessions = this.analyticsData.sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      const sessionDateStr = sessionDate.toISOString().split('T')[0];
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      return sessionDateStr >= startDateStr && sessionDateStr <= endDateStr;
    });
    
    console.log(`📊 Found ${filteredSessions.length} sessions in date range`);
    
    // Calculate filtered stats
    const rangeStats = {
      totalSessions: filteredSessions.length,
      totalTime: 0,
      messagesSent: 0,
      messagesReceived: 0,
      platformsUsed: new Set(),
      sessions: filteredSessions
    };
    
    // Calculate totals from filtered sessions
    filteredSessions.forEach(session => {
      rangeStats.totalTime += session.timeSpent || 0;
      rangeStats.messagesSent += session.interactions || 0;
      rangeStats.messagesReceived += session.interactions || 0; // Assuming interactions are both sent and received
      
      if (session.platform) {
        rangeStats.platformsUsed.add(session.platform);
      }
    });
    
    // Update dashboard with filtered data
    this.updateDashboardWithData(rangeStats);
    
    // Store current filter
    this.currentDateFilter = {
      type: 'range',
      startDate: startInput.value,
      endDate: endInput.value
    };
  }
  
  filterPlatforms(filter) {
    // Implementation for platform filtering
    console.log('Platform filter updated:', filter);
  }
  
  // Utility functions
  formatDuration(ms) {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }
  
  getPlatformType(name) {
    const tier1Platforms = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Poe'];
    return tier1Platforms.includes(name) ? 'Tier 1' : 'Tier 2';
  }

  getToolIcon(platformName) {
    // Search through all tool categories
    for (const category of Object.values(this.aiTools)) {
      const tool = category.find(t => t.name === platformName);
      if (tool) {
        return tool.icon;
      }
    }
    return null;
  }
  
  initializeDarkMode() {
    // Check for saved preference
    const savedMode = localStorage.getItem('dashboardDarkMode');
    
    if (savedMode === 'true') {
      this.enableDarkMode();
    } else if (savedMode === 'false') {
      this.disableDarkMode();
    } else {
      // Default to light mode if no preference is saved
      this.disableDarkMode();
    }
  }
  
  toggleDarkMode() {
    if (this.isDarkMode) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }
  
  enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    this.isDarkMode = true;
    localStorage.setItem('dashboardDarkMode', 'true');
    
    // Update charts for dark mode
    this.updateChartsForDarkMode();
  }
  
  disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    this.isDarkMode = false;
    localStorage.setItem('dashboardDarkMode', 'false');
    
    // Update charts for light mode
    this.updateChartsForLightMode();
  }
  
  updateChartsForDarkMode() {
    if (typeof Chart === 'undefined') return;
    
    // Update chart colors for dark mode
    const darkModeColors = {
      text: '#e1e5e9',
      grid: '#404040',
      background: '#2d2d2d'
    };
    
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.options) {
        // Update text colors
        if (chart.options.plugins && chart.options.plugins.legend) {
          chart.options.plugins.legend.labels = {
            ...chart.options.plugins.legend.labels,
            color: darkModeColors.text
          };
        }
        
        // Update axis colors
        if (chart.options.scales) {
          Object.values(chart.options.scales).forEach(scale => {
            if (scale.grid) {
              scale.grid.color = darkModeColors.grid;
            }
            if (scale.ticks) {
              scale.ticks.color = darkModeColors.text;
            }
          });
        }
        
        chart.update('none');
      }
    });
  }
  
  updateChartsForLightMode() {
    if (typeof Chart === 'undefined') return;
    
    // Update chart colors for light mode
    const lightModeColors = {
      text: '#1f2937',
      grid: '#e5e7eb',
      background: '#ffffff'
    };
    
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.options) {
        // Update text colors
        if (chart.options.plugins && chart.options.plugins.legend) {
          chart.options.plugins.legend.labels = {
            ...chart.options.plugins.legend.labels,
            color: lightModeColors.text
          };
        }
        
        // Update axis colors
        if (chart.options.scales) {
          Object.values(chart.options.scales).forEach(scale => {
            if (scale.grid) {
              scale.grid.color = lightModeColors.grid;
            }
            if (scale.ticks) {
              scale.ticks.color = lightModeColors.text;
            }
          });
        }
        
        chart.update('none');
      }
    });
  }
}

// Initialize jsPDF when available
if (typeof window.jspdf !== 'undefined') {
  window.jsPDF = window.jspdf.jsPDF;
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
  new Dashboard();
});