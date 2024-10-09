function checkSavedOptions() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['gptApiKey', 'claudeApiKey'], function(items) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving options:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log('Current saved options (background):', {
          gptApiKey: items.gptApiKey ? 'Set (not shown for security)' : 'Not set',
          claudeApiKey: items.claudeApiKey ? 'Set (not shown for security)' : 'Not set'
        });
        resolve(items);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    const { input, model, apiKey } = request;

    console.log('Sending to server:', { input, model }); // Log the data being sent

    if (!input || !model || !apiKey) {
      sendResponse({error: 'Missing input, model, or API key'});
      return true;
    }

    const data = {
      input: input,
      model: model,
      api_key: apiKey
    };

    fetch('https://summurise-tnc-165914bd9dc7.herokuapp.com/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data); // Log the server response
      if (data.error) {
        sendResponse({error: data.error});
      } else if (data.summary) {
        sendResponse({summary: data.summary});
      } else {
        sendResponse({error: 'Unexpected response format'});
      }
    })
    .catch(error => {
      console.error('Error:', error);
      console.error('Error details:', error);
      sendResponse({error: error.toString()});
    });

    return true;  // Will respond asynchronously
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed. Checking initial options...');
  checkSavedOptions();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Extension started. Checking options...');
  checkSavedOptions();
});