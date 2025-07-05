// Side panel functionality
let currentStudentInfo = {
  studentId: 'Unknown Student',
  studentName: 'Not Set',
  className: 'Not Set',
  chromebookNumber: 'Not Set'
};
let activityData = [];

// Load student information and initial data
document.addEventListener('DOMContentLoaded', () => {
  loadStudentInfo();
  loadActivityData();
  
  // Set up refresh button
  document.getElementById('refreshBtn').addEventListener('click', loadActivityData);
  
  // Set up student info form
  setupStudentForm();
});

// Load student information from storage
function loadStudentInfo() {
  chrome.storage.local.get(['studentId', 'studentName', 'className', 'chromebookNumber'], (result) => {
    if (result.studentId) {
      currentStudentInfo = {
        studentId: result.studentId,
        studentName: result.studentName,
        className: result.className,
        chromebookNumber: result.chromebookNumber
      };
      document.getElementById('deviceName').textContent = `${result.studentName} - ${result.className} - CB${result.chromebookNumber}`;
      document.getElementById('studentForm').style.display = 'none';
    } else {
      document.getElementById('deviceName').textContent = 'Please set your information below';
      document.getElementById('studentForm').style.display = 'block';
    }
  });
}

// Setup student form
function setupStudentForm() {
  const form = document.getElementById('infoForm');
  const statusDiv = document.getElementById('formStatus');
  
  // Load existing data into form
  chrome.storage.local.get(['studentName', 'className', 'chromebookNumber'], (result) => {
    if (result.studentName) {
      document.getElementById('studentName').value = result.studentName;
    }
    if (result.className) {
      document.getElementById('className').value = result.className;
    }
    if (result.chromebookNumber) {
      document.getElementById('chromebookNumber').value = result.chromebookNumber;
    }
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentName = document.getElementById('studentName').value.trim();
    const className = document.getElementById('className').value.trim();
    const chromebookNumber = document.getElementById('chromebookNumber').value.trim();
    
    if (!studentName || !className || !chromebookNumber) {
      showFormStatus('Please fill in all fields.', 'error');
      return;
    }
    
    // Create a unique identifier
    const studentId = `${studentName} - ${className} - CB${chromebookNumber}`;
    
    chrome.storage.local.set({ 
      studentName,
      className, 
      chromebookNumber,
      studentId
    }, () => {
      showFormStatus('Information saved successfully!', 'success');
      
      // Update the display
      setTimeout(() => {
        loadStudentInfo();
        document.getElementById('studentForm').style.display = 'none';
      }, 1500);
    });
  });
}

function showFormStatus(message, type) {
  const statusDiv = document.getElementById('formStatus');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Load activity data from backend
async function loadActivityData() {
  try {
    const response = await fetch('https://backend-khaki-phi-30.vercel.app/api/history');
    const data = await response.json();
    
    // Filter data for current student
    activityData = data.browsingData.filter(item => item.studentId === currentStudentInfo.studentId);
    
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
