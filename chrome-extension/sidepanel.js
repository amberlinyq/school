// Side panel functionality
let currentStudentInfo = {
  studentId: 'Unknown Student',
  studentName: 'Not Set',
  className: 'Not Set',
  chromebookNumber: 'Not Set'
};
let activityData = [];

// Store recent activities
let recentActivities = [];
let gameWarningShown = false;
let studentInfoSet = false;

// Initialize the side panel
document.addEventListener('DOMContentLoaded', function() {
  loadStudentInfo();
  loadRecentActivity();
  setupEventListeners();
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GAME_WARNING') {
      showGameWarning(message.data.url);
    } else if (message.type === 'ACTIVITY_UPDATED') {
      addActivity(message.data);
    }
  });
});

// Set up event listeners
function setupEventListeners() {
  document.getElementById('saveBtn').addEventListener('click', saveStudentInfo);
  document.getElementById('refreshBtn').addEventListener('click', loadRecentActivity);
  document.getElementById('editInfoBtn').addEventListener('click', showEditForm);
}

// Load student information from storage
function loadStudentInfo() {
  chrome.storage.local.get(['studentId', 'studentName', 'className', 'chromebookNumber'], function(result) {
    if (result.studentName && result.className && result.chromebookNumber) {
      // Student info is set - show greeting
      document.getElementById('studentName').value = result.studentName;
      document.getElementById('className').value = result.className;
      document.getElementById('chromebookNumber').value = result.chromebookNumber;
      
      // Update greeting
      document.getElementById('greetingName').textContent = result.studentName;
      document.getElementById('greetingClass').textContent = result.className;
      document.getElementById('greetingDevice').textContent = `Chromebook #${result.chromebookNumber}`;
      
      // Show greeting, hide form
      document.getElementById('studentGreeting').style.display = 'block';
      document.getElementById('studentForm').style.display = 'none';
      
      // Set device name display
      const deviceName = `Chromebook #${result.chromebookNumber}`;
      document.getElementById('deviceName').textContent = deviceName;
      
      // Hide setup reminder
      document.getElementById('setupReminder').style.display = 'none';
      studentInfoSet = true;
    } else {
      // Student info not set - show form
      document.getElementById('studentGreeting').style.display = 'none';
      document.getElementById('studentForm').style.display = 'block';
      document.getElementById('deviceName').textContent = 'Please set up your information below';
      document.getElementById('setupReminder').style.display = 'block';
      studentInfoSet = false;
    }
  });
}

// Show edit form
function showEditForm() {
  document.getElementById('studentGreeting').style.display = 'none';
  document.getElementById('studentForm').style.display = 'block';
}

// Save student information
function saveStudentInfo() {
  const studentName = document.getElementById('studentName').value.trim();
  const className = document.getElementById('className').value.trim();
  const chromebookNumber = document.getElementById('chromebookNumber').value.trim();
  
  if (!studentName || !className || !chromebookNumber) {
    showStatus('Please fill in all fields', 'error');
    return;
  }
  
  const studentId = `${studentName}-${className}-${chromebookNumber}`;
  
  chrome.storage.local.set({
    studentId: studentId,
    studentName: studentName,
    className: className,
    chromebookNumber: chromebookNumber
  }, function() {
    showStatus('Information saved successfully!', 'success');
    
    // Update greeting
    document.getElementById('greetingName').textContent = studentName;
    document.getElementById('greetingClass').textContent = className;
    document.getElementById('greetingDevice').textContent = `Chromebook #${chromebookNumber}`;
    
    // Show greeting, hide form
    document.getElementById('studentGreeting').style.display = 'block';
    document.getElementById('studentForm').style.display = 'none';
    
    document.getElementById('deviceName').textContent = `Chromebook #${chromebookNumber}`;
    document.getElementById('setupReminder').style.display = 'none';
    studentInfoSet = true;
    
    // Hide status after 3 seconds
    setTimeout(() => {
      document.getElementById('saveStatus').style.display = 'none';
    }, 3000);
  });
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('saveStatus');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = 'block';
}

// Load recent activity from storage
function loadRecentActivity() {
  chrome.storage.local.get(['recentActivities'], function(result) {
    if (result.recentActivities) {
      recentActivities = result.recentActivities;
      updateActivityDisplay();
      updateStats();
    }
  });
}

// Add new activity
function addActivity(activity) {
  // Only track activity if student info is set
  if (!studentInfoSet) {
    return;
  }
  
  recentActivities.unshift(activity);
  
  // Keep only last 20 activities
  if (recentActivities.length > 20) {
    recentActivities = recentActivities.slice(0, 20);
  }
  
  // Save to storage
  chrome.storage.local.set({ recentActivities: recentActivities });
  
  // Update display
  updateActivityDisplay();
  updateStats();
  
  // Show game warning if needed
  if (activity.isGameSite && !gameWarningShown) {
    showGameWarning(activity.url);
  }
}

// Helper function to get hostname from URL
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return url;
  }
}

// Helper function to truncate URL
function truncateUrl(url, maxLength = 40) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

// Update activity display
function updateActivityDisplay() {
  const container = document.getElementById('recentActivity');
  
  if (!studentInfoSet) {
    container.innerHTML = `
      <div class="activity-item">
        <div class="activity-hostname">Set up your information first</div>
        <div class="activity-time">Fill in your details above to start tracking</div>
      </div>
    `;
    return;
  }
  
  if (recentActivities.length === 0) {
    container.innerHTML = `
      <div class="activity-item">
        <div class="activity-hostname">No activity yet</div>
        <div class="activity-time">Get started by browsing!</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = recentActivities.slice(0, 10).map(activity => {
    const time = new Date(activity.timestamp).toLocaleTimeString();
    const hostname = getHostname(activity.url);
    const category = activity.isGameSite ? 'game' : 'educational';
    const categoryText = activity.isGameSite ? 'Game Site' : 'Educational';
    const truncatedUrl = truncateUrl(activity.url, 35);
    
    return `
      <div class="activity-item">
        <div class="activity-hostname">${hostname}</div>
        <div class="activity-category ${category}">${categoryText}</div>
        <a href="${activity.url}" target="_blank" class="activity-link" title="${activity.url}">${truncatedUrl}</a>
        <div class="activity-time">${time}</div>
      </div>
    `;
  }).join('');
}

// Update statistics
function updateStats() {
  if (!studentInfoSet) {
    document.getElementById('sitesVisited').textContent = '0';
    document.getElementById('focusScore').textContent = '100%';
    document.getElementById('statusBadge').textContent = 'Not Set Up';
    document.getElementById('statusBadge').className = 'badge badge-warning';
    return;
  }
  
  const totalSites = recentActivities.length;
  const gameSites = recentActivities.filter(a => a.isGameSite).length;
  const regularSites = totalSites - gameSites;
  
  // Calculate focus score (percentage of non-game sites)
  const focusScore = totalSites > 0 ? Math.round(((totalSites - gameSites) / totalSites) * 100) : 100;
  
  document.getElementById('sitesVisited').textContent = totalSites;
  document.getElementById('focusScore').textContent = `${focusScore}%`;
  
  // Update status badge
  const statusBadge = document.getElementById('statusBadge');
  if (focusScore >= 90) {
    statusBadge.textContent = 'On Task';
    statusBadge.className = 'badge badge-success';
    showEncouragement();
  } else if (focusScore >= 70) {
    statusBadge.textContent = 'Needs Focus';
    statusBadge.className = 'badge badge-warning';
  } else {
    statusBadge.textContent = 'Off Task';
    statusBadge.className = 'badge badge-danger';
  }
}

// Show game warning
function showGameWarning(url) {
  const warning = document.getElementById('gameWarning');
  warning.style.display = 'block';
  gameWarningShown = true;
  
  // Hide warning after 10 seconds
  setTimeout(() => {
    warning.style.display = 'none';
    gameWarningShown = false;
  }, 10000);
}

// Show encouragement message
function showEncouragement() {
  const encouragement = document.getElementById('encouragement');
  encouragement.style.display = 'block';
  
  // Hide encouragement after 5 seconds
  setTimeout(() => {
    encouragement.style.display = 'none';
  }, 5000);
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
