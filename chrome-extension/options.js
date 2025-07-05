document.addEventListener('DOMContentLoaded', () => {
  const studentNameInput = document.getElementById('studentName');
  const classNameInput = document.getElementById('className');
  const chromebookNumberInput = document.getElementById('chromebookNumber');
  const form = document.getElementById('studentForm');
  const statusDiv = document.getElementById('status');

  // Load saved student information
  chrome.storage.local.get(['studentName', 'className', 'chromebookNumber'], (result) => {
    if (result.studentName) {
      studentNameInput.value = result.studentName;
    }
    if (result.className) {
      classNameInput.value = result.className;
    }
    if (result.chromebookNumber) {
      chromebookNumberInput.value = result.chromebookNumber;
    }
  });

  // Save student information
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentName = studentNameInput.value.trim();
    const className = classNameInput.value.trim();
    const chromebookNumber = chromebookNumberInput.value.trim();
    
    if (!studentName || !className || !chromebookNumber) {
      showStatus('Please fill in all fields.', 'error');
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
      showStatus('Student information saved successfully!', 'success');
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}); 