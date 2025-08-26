// Popup Script for AI Analytics
document.addEventListener('DOMContentLoaded', function() {
  // Initialize popup
  loadAnalytics();
  setupEventListeners();
  loadPrivacySettings();
});

// Load analytics data from background script
async function loadAnalytics() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
    if (response) {
      updateQuickStats(response);
      updatePlatformList(response.platformUsage);
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

// Update quick stats display
function updateQuickStats(data) {
  const today = new Date().toISOString().split('T')[0];
  const todayStats = data.dailyStats[today] || {
    totalSessions: 0,
    totalTime: 0,
    platformsUsed: new Set()
  };
  
  // Update session count
  document.getElementById('todaySessions').textContent = todayStats.totalSessions;
  
  // Update time spent
  const minutes = Math.round(todayStats.totalTime / (1000 * 60));
  document.getElementById('todayTime').textContent = `${minutes}m`;
}

// Update platform usage list
function updatePlatformList(platformUsage) {
  const platformList = document.getElementById('platformList');
  
  if (!platformUsage || Object.keys(platformUsage).length === 0) {
    platformList.innerHTML = '<div class="no-data">No AI usage detected yet</div>';
    return;
  }
  
  // Sort platforms by total time
  const sortedPlatforms = Object.entries(platformUsage)
    .sort(([,a], [,b]) => b.totalTime - a.totalTime)
    .slice(0, 5); // Show top 5
  
  platformList.innerHTML = sortedPlatforms.map(([name, stats]) => {
    const minutes = Math.round(stats.totalTime / (1000 * 60));
    return `
      <div class="platform-item">
        <span class="platform-name">${name}</span>
        <span class="platform-time">${minutes}m</span>
      </div>
    `;
  }).join('');
}

// Setup event listeners
function setupEventListeners() {
  // Privacy settings toggles
  document.getElementById('workHoursOnly').addEventListener('change', updatePrivacySettings);
  document.getElementById('individualOptOut').addEventListener('change', updatePrivacySettings);
  
  // Action buttons
  document.getElementById('openDashboard').addEventListener('click', openDashboard);
  document.getElementById('exportData').addEventListener('click', exportData);
  document.getElementById('openTestPage').addEventListener('click', openTestPage);
  
  // Privacy modal
  document.getElementById('privacyInfo').addEventListener('click', showPrivacyModal);
  document.getElementById('closeModal').addEventListener('click', hidePrivacyModal);
  
  // Close modal when clicking outside
  document.getElementById('privacyModal').addEventListener('click', (e) => {
    if (e.target.id === 'privacyModal') {
      hidePrivacyModal();
    }
  });
}

// Load privacy settings
async function loadPrivacySettings() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
    if (response && response.privacySettings) {
      const settings = response.privacySettings;
      document.getElementById('workHoursOnly').checked = settings.workHoursOnly;
      document.getElementById('individualOptOut').checked = settings.individualOptOut;
    }
  } catch (error) {
    console.error('Error loading privacy settings:', error);
  }
}

// Update privacy settings
async function updatePrivacySettings() {
  const settings = {
    workHoursOnly: document.getElementById('workHoursOnly').checked,
    individualOptOut: document.getElementById('individualOptOut').checked
  };
  
  try {
    await chrome.runtime.sendMessage({
      type: 'UPDATE_PRIVACY_SETTINGS',
      settings: settings
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
  }
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('dashboard.html')
  });
}

// Open test page
function openTestPage() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('comprehensive-test.html')
  });
}

// Export data
async function exportData() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_ANALYTICS' });
    if (response) {
      const dataStr = JSON.stringify(response, null, 2);
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
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

// Show privacy modal
function showPrivacyModal() {
  document.getElementById('privacyModal').classList.add('show');
}

// Hide privacy modal
function hidePrivacyModal() {
  document.getElementById('privacyModal').classList.remove('show');
}

// Format time duration
function formatDuration(ms) {
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Refresh data periodically
setInterval(loadAnalytics, 30000); // Refresh every 30 seconds 