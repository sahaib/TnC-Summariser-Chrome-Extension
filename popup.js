document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const modelSelect = document.getElementById('model-select');
    const summarizeBtn = document.getElementById('summarize-btn');
    const resultDiv = document.getElementById('result');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const openaiApiKeyInput = document.getElementById('openai-api-key');
    const anthropicApiKeyInput = document.getElementById('anthropic-api-key');
    const statusDiv = document.getElementById('status');
    const modal = document.getElementById('summary-modal');
    const summaryText = document.getElementById('summary-text');
    const closeModal = document.getElementsByClassName('close')[0];
    const summarizeTab = document.getElementById('summarize-tab');
    const settingsTab = document.getElementById('settings-tab');
    const summarizeContent = document.getElementById('Summarize');
    const settingsContent = document.getElementById('Settings');

    // Load saved settings when popup opens
    loadSavedSettings();

    function loadSavedSettings() {
        chrome.storage.sync.get(['openaiApiKey', 'anthropicApiKey', 'selectedModel'], function(result) {
            openaiApiKeyInput.value = result.openaiApiKey || '';
            anthropicApiKeyInput.value = result.anthropicApiKey || '';
            if (result.selectedModel) {
                modelSelect.value = result.selectedModel;
            }
            updateStatus();
        });
    }

    function updateStatus() {
        const openaiSet = openaiApiKeyInput.value ? 'Set' : 'Not set';
        const anthropicSet = anthropicApiKeyInput.value ? 'Set' : 'Not set';
        statusDiv.textContent = `OpenAI API Key: ${openaiSet}, Anthropic API Key: ${anthropicSet}, Model: ${modelSelect.value}`;
    }

    saveSettingsBtn.addEventListener('click', function() {
        chrome.storage.sync.set({
            openaiApiKey: openaiApiKeyInput.value,
            anthropicApiKey: anthropicApiKeyInput.value,
            selectedModel: modelSelect.value
        }, function() {
            alert('Settings saved!');
            updateStatus();
        });
    });

    summarizeBtn.addEventListener('click', function() {
        const input = inputText.value;
        const model = modelSelect.value;
        resultDiv.innerHTML = 'Processing...';

        let apiKey;
        if (model === 'gpt-4o-mini') {
            apiKey = openaiApiKeyInput.value;
        } else if (model === 'claude-3-sonnet-20240229') {
            apiKey = anthropicApiKeyInput.value;
        }

        if (!input || !apiKey) {
            resultDiv.innerHTML = 'Error: Missing input or API key';
            return;
        }

        sendSummarizeRequest(input, model, apiKey);
    });

    function sendSummarizeRequest(content, model, apiKey) {
        console.log('Sending request with:', { content: content.substring(0, 100) + '...', model, apiKey: 'HIDDEN' });

        chrome.runtime.sendMessage({
            action: "summarize",
            input: content,
            model: model,
            apiKey: apiKey
        }, function(response) {
            console.log('Full response:', response);

            if (chrome.runtime.lastError) {
                console.error('Runtime error:', chrome.runtime.lastError);
                resultDiv.innerHTML = `Error: ${chrome.runtime.lastError.message}`;
            } else if (response && response.error) {
                console.error('Response error:', response.error);
                resultDiv.innerHTML = `Error: ${response.error}`;
            } else if (response && response.summary) {
                console.log('Received summary:', response.summary);
                
                // Display raw summary data
                summaryText.innerHTML = `
                    <h2>Privacy Policy Summary</h2>
                    <pre>${response.summary}</pre>
                `;
                
                modal.style.display = "block";
                resultDiv.innerHTML = 'Summary generated. Click to view.';
            } else {
                console.error('Unexpected response:', response);
                resultDiv.innerHTML = 'Unexpected response from the server';
            }
        });
    }

    // Adjust modal size and position
    modal.style.width = '570px';  // Slightly smaller than the popup
    modal.style.height = '570px';
    modal.style.top = '10px';
    modal.style.left = '10px';

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Tab switching functionality
    summarizeTab.addEventListener('click', function() {
        summarizeContent.style.display = 'block';
        settingsContent.style.display = 'none';
        summarizeTab.classList.add('active');
        settingsTab.classList.remove('active');
    });

    settingsTab.addEventListener('click', function() {
        summarizeContent.style.display = 'none';
        settingsContent.style.display = 'block';
        settingsTab.classList.add('active');
        summarizeTab.classList.remove('active');
    });
});
