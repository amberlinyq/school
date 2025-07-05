document.addEventListener('DOMContentLoaded', () => {
  const deviceInput = document.getElementById('deviceName');
  const form = document.getElementById('deviceForm');
  const ipAddressSpan = document.getElementById('ipAddress');

  // Load IP address
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      ipAddressSpan.textContent = data.ip;
      chrome.storage.local.set({ ipAddress: data.ip });
    })
    .catch(() => {
      ipAddressSpan.textContent = 'Could not load IP';
    });

  // Load saved device name
  chrome.storage.local.get(['deviceName'], (result) => {
    if (result.deviceName) {
      deviceInput.value = result.deviceName;
    }
  });

  // Save device name
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const deviceName = deviceInput.value.trim();
    chrome.storage.local.set({ deviceName }, () => {
      if (deviceName) {
        alert('Custom device name saved!');
      } else {
        alert('Device name cleared. IP address will be used instead.');
      }
    });
  });
}); 