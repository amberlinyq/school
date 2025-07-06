// Load student information when popup opens
document.addEventListener('DOMContentLoaded', function() {
  loadStudentInfo();
  
  // Set up button event listeners
  document.getElementById('openSidePanel').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.sidePanel.open({tabId: tabs[0].id});
      window.close();
    });
  });
});

// Load and display student information
function loadStudentInfo() {
  chrome.storage.local.get(['studentId', 'studentName', 'className', 'chromebookNumber'], function(result) {
    const studentName = result.studentName || 'Not Set';
    const className = result.className || 'Not Set';
    const deviceName = result.chromebookNumber ? `Chromebook #${result.chromebookNumber}` : 'Not Set';
    
    document.getElementById('studentName').textContent = studentName;
    document.getElementById('className').textContent = className;
    document.getElementById('deviceName').textContent = deviceName;
    
    // Show setup reminder if info not complete
    if (!result.studentName || !result.className || !result.chromebookNumber) {
      document.getElementById('setupReminder').style.display = 'block';
    } else {
      document.getElementById('setupReminder').style.display = 'none';
    }
  });
}

// Listen for game warnings from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GAME_WARNING') {
    showGameWarning();
  }
});

// Show game warning in popup
function showGameWarning() {
  const warning = document.getElementById('gameWarning');
  warning.style.display = 'block';
  
  // Hide warning after 5 seconds
  setTimeout(() => {
    warning.style.display = 'none';
  }, 5000);
} 