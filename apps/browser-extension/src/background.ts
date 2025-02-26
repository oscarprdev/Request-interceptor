import browser from 'webextension-polyfill';

console.log('Background script loaded');

// Simple message listener
browser.runtime.onMessage.addListener((message, sender) => {
  console.log('Received message:', message, 'from:', sender);
  return Promise.resolve({ success: true });
});

// Log web requests for debugging
browser.webRequest.onBeforeRequest.addListener(
  details => {
    console.log('Request intercepted:', details.url);
  },
  { urls: ['<all_urls>'] }
);
