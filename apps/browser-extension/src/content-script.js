// This content script injects the page script that will intercept fetch requests
(function () {
  // Only inject scripts on top-level documents (not iframes)
  if (window.self !== window.top) return;

  // Inject the page scripts
  const injectScript = file => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL(file));
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
      script.remove();
    };
  };

  // Inject our interceptor scripts
  injectScript('page-scripts/utils.js');
  injectScript('page-scripts/fetch.js');
  injectScript('page-scripts/index.js');

  // Listen for messages from the page script
  window.addEventListener(
    'message',
    event => {
      // Only accept messages from the same frame
      if (event.source !== window) return;

      // Check if the message is from our page script
      if (event.data && event.data.source === 'requestai:client') {
        // Forward the message to the background script
        chrome.runtime.sendMessage(event.data);
      }
    },
    false
  );

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(message => {
    // Forward configuration updates to the page script
    if (message.source === 'requestai:extension' && message.action === 'updateConfig') {
      window.postMessage(message, window.location.href);
    }
    return true;
  });

  // Notify the background script that the content script is ready
  chrome.runtime.sendMessage({
    source: 'requestai:client',
    action: 'pageScriptInitialized',
  });
})();
