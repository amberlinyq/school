// Side panel functionality
let currentDeviceIdentifier = 'Unknown Device';
let activityData = [];

// Load device identifier and initial data
document.addEventListener('DOMContentLoaded', () => {
  loadDeviceIdentifier();
  loadActivityData();
  
  // Set up refresh button
  document.getElementById('refreshBtn').addEventListener('click', loadActivityData);
});

// Load device identifier (IP address or device name) from storage
function loadDeviceIdentifier() {
  chrome.storage.local.get(['deviceName', 'ipAddress'], (result) => {
    if (result.ipAddress) {
      currentDeviceIdentifier = result.ipAddress;
      document.getElementById('deviceName').textContent = `IP: ${result.ipAddress}`;
    } else if (result.deviceName) {
      currentDeviceIdentifier = result.deviceName;
      document.getElementById('deviceName').textContent = `Device: ${result.deviceName}`;
    } else {
      // Try to fetch IP address directly
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          currentDeviceIdentifier = data.ip;
          document.getElementById('deviceName').textContent = `IP: ${data.ip}`;
          chrome.storage.local.set({ ipAddress: data.ip });
        })
        .catch(() => {
          currentDeviceIdentifier = 'Unknown Device';
          document.getElementById('deviceName').textContent = 'Unknown Device';
        });
    }
  });
}

// Load activity data from backend
async function loadActivityData() {
  try {
    const response = await fetch('https://backend-khaki-phi-30.vercel.app/api/history');
    const data = await response.json();
    
    // Filter data for current device
    activityData = data.browsingData.filter(item => item.deviceName === currentDeviceIdentifier);
    
    updateStats();
    updateRecentActivity();
  } catch (error) {
    console.log('Could not load activity data:', error.message);
    // Show offline message
    document.getElementById('recentActivity').innerHTML = `
      <div style="text-align: center; color: #6c757d; padding: 20px;">
        Backend not available. Check if server is running.
      </div>
    `;
  }
}

// Update statistics
function updateStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter today's activity
  const todayActivity = activityData.filter(item => {
    const itemDate = new Date(item.timestamp);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate.getTime() === today.getTime();
  });
  
  const gameSites = todayActivity.filter(item => item.isGameSite).length;
  const regularSites = todayActivity.filter(item => !item.isGameSite).length;
  const totalSites = todayActivity.length;
  
  document.getElementById('totalSites').textContent = totalSites;
  document.getElementById('gameSites').textContent = gameSites;
  document.getElementById('regularSites').textContent = regularSites;
}

// Update recent activity list
function updateRecentActivity() {
  const recentActivityDiv = document.getElementById('recentActivity');
  
  if (activityData.length === 0) {
    recentActivityDiv.innerHTML = `
      <div style="text-align: center; color: #6c757d; padding: 20px;">
        No activity yet...
      </div>
    `;
    return;
  }
  
  // Get last 10 activities
  const recentItems = activityData.slice(-10).reverse();
  
  const activityHTML = recentItems.map(item => {
    const time = new Date(item.timestamp).toLocaleTimeString();
    const badgeClass = item.isGameSite ? 'badge-danger' : 'badge-success';
    const badgeText = item.isGameSite ? 'Game' : 'Regular';
    
    return `
      <div class="activity-item">
        <div>
          <a href="${item.url}" target="_blank" class="activity-url">${getDomainFromUrl(item.url)}</a>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="activity-time">${time}</div>
      </div>
    `;
  }).join('');
  
  recentActivityDiv.innerHTML = activityHTML;
}

// Helper function to get domain from URL
function getDomainFromUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACTIVITY_UPDATED') {
    // Refresh data when new activity is tracked
    loadActivityData();
  }
}); 
