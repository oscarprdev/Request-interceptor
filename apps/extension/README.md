# Request Interceptor Extension

This browser extension intercepts and modifies HTTP requests based on configured rules.

## Features

- Intercept HTTP requests based on URL patterns
- Modify responses with custom data
- View active rules through the extension popup

## Extension Popup

The extension now includes a popup interface that allows you to:

- View all active dynamic rules
- See rule details (URL filters, request methods, etc.)
- Refresh rules manually

## Setup

Load the extension in Chrome:

- Go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `apps/extension` directory

## Usage

1. Click the extension icon in the browser toolbar to open the popup
2. View the list of active rules
3. Click on a rule to expand and see its details
4. Use the "Refresh" button to update the rules list

## Development

The popup is built with plain HTML, CSS, and JavaScript:

- `popup.html` - The HTML structure for the popup
- `popup.js` - JavaScript that fetches and displays the rules
- `popup.css` - Styling for the popup interface

## Adding Rules

Rules are managed through the main application and synced with the extension.
