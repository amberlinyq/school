// List of keywords/domains to detect game sites
const GAME_KEYWORDS = [
  'coolmathgames', 'poki', 'crazygames', 'games', 'miniclip', 'roblox', 'minecraft', 'fortnite', 'game', 'y8', 'addictinggames'
];

// Helper to check if a URL is a game site
function isGameSite(url) {
  return GAME_KEYWORDS.some(keyword => url.includes(keyword));
}

// Send browsing data to backend
function reportActivity(data) {
  // For testing, log to console and send to local server
  console.log('Activity tracked:', data);
  
  fetch('https://your-backend-url.vercel.app/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    // Notify side panel about new activity
    chrome.runtime.sendMessage({ type: 'ACTIVITY_UPDATED', data });
  }).catch(err => {
    console.log('Backend not running yet:', err.message);
  });
}

// Get IP address or device name from storage
function getDeviceIdentifier(callback) {
  chrome.storage.local.get(['deviceName', 'ipAddress'], (result) => {
    if (result.ipAddress) {
      callback(result.ipAddress);
    } else if (result.deviceName) {
      callback(result.deviceName);
    } else {
      // Try to get IP address from a public API
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          chrome.storage.local.set({ ipAddress: data.ip });
          callback(data.ip);
        })
        .catch(() => {
          callback('Unknown Device');
        });
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    getDeviceIdentifier((deviceIdentifier) => {
      const activity = {
        url: tab.url,
        timestamp: Date.now(),
        deviceName: deviceIdentifier,
        isGameSite: isGameSite(tab.url)
      };
      reportActivity(activity);
    });
  }
});

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
}); 