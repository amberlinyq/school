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
  
  fetch('https://backend-khaki-phi-30.vercel.app/api/activity', {
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

// Get student information from storage
function getStudentInfo(callback) {
  chrome.storage.local.get(['studentId', 'studentName', 'className', 'chromebookNumber'], (result) => {
    if (result.studentId) {
      callback({
        studentId: result.studentId,
        studentName: result.studentName,
        className: result.className,
        chromebookNumber: result.chromebookNumber
      });
    } else {
      callback({
        studentId: 'Unknown Student',
        studentName: 'Not Set',
        className: 'Not Set',
        chromebookNumber: 'Not Set'
      });
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    getStudentInfo((studentInfo) => {
      const activity = {
        url: tab.url,
        timestamp: Date.now(),
        studentId: studentInfo.studentId,
        studentName: studentInfo.studentName,
        className: studentInfo.className,
        chromebookNumber: studentInfo.chromebookNumber,
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
