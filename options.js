document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('api_key').value;
    chrome.storage.sync.set({ apiKey }, () => {
      alert('API Key saved.');
    });
  });
  
  chrome.storage.sync.get('apiKey', ({ apiKey }) => {
    if (apiKey) {
      document.getElementById('api_key').value = apiKey;
    }
  });