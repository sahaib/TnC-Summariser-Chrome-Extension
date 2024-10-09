# Privacy Policy Summarizer Chrome Extension

## Description

The Privacy Policy Summarizer is a Chrome extension that uses advanced AI models (GPT-4O Mini and Claude 3 Sonnet) to generate concise summaries of privacy policies. This tool helps users quickly understand the key points of lengthy privacy documents, saving time and improving comprehension.

## Features

- Summarize privacy policies from URLs or pasted text
- Choose between two AI models: GPT-4O Mini and Claude 3 Sonnet
- Easy-to-use interface within the Chrome browser
- Customizable API key settings for OpenAI and Anthropic
- Responsive design with a 590x590 pixel popup

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar.
2. Enter a URL or paste the text of a privacy policy in the input box.
3. Select the AI model you want to use (GPT-4O Mini or Claude 3 Sonnet).
4. Click "Summarize" to generate a summary.
5. View the summarized points in a clear, bulleted list format.

## Configuration

1. Click the settings icon (gear) in the extension popup.
2. Enter your OpenAI and Anthropic API keys in the respective fields.
3. Click "Save Settings" to store your API keys securely.

## Development

This project uses:
- HTML, CSS, and JavaScript for the frontend
- Python with Flask for the backend server
- OpenAI and Anthropic APIs for AI-powered summarization

To set up the development environment:
1. Install Python and pip.
2. Install required Python packages: `pip install flask anthropic openai`
3. Set up your OpenAI and Anthropic API keys as environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Disclaimer

This tool is for informational purposes only. Always read the full privacy policy for complete information.
