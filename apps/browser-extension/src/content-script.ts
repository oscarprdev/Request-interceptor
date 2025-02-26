import browser from 'webextension-polyfill';

console.log('Content script loaded');

// Send a message to the background script
browser.runtime
  .sendMessage({ type: 'CONTENT_SCRIPT_LOADED' })
  .then(response => {
    console.log('Response from background:', response);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
