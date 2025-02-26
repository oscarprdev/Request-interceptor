import { initFetchInterceptor } from './fetch';

// Initialize the fetch interceptor
(() => {
  // Check if debug mode is enabled
  let isDebugMode = false;
  try {
    isDebugMode = window.localStorage && localStorage.getItem('requestaiDebugMode') === 'true';
  } catch (e) {
    // Ignore localStorage errors
  }

  // Initialize the global config object
  window.requestaiConfig = window.requestaiConfig || {
    requestRules: [],
    responseRules: [],
  };

  // Listen for configuration updates from the extension
  window.addEventListener('message', event => {
    if (event.data && event.data.source === 'requestai:extension') {
      if (event.data.action === 'updateConfig') {
        window.requestaiConfig = event.data.config;
      }
    }
  });

  // Initialize the fetch interceptor
  initFetchInterceptor(isDebugMode);

  // Notify the extension that we're ready
  window.top.postMessage(
    {
      source: 'requestai:client',
      action: 'pageScriptInitialized',
    },
    window.location.href
  );
})();
