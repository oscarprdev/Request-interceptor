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

  // Store configuration
  let config = {
    requestRules: [],
    responseRules: [],
  };

  // Initialize the interceptor
  const interceptor = initFetchInterceptor(isDebugMode);

  // Listen for configuration updates from the extension
  window.addEventListener(
    'message',
    event => {
      // Only accept messages from the same frame
      if (event.source !== window) return;

      const message = event.data;

      // Check if the message is a config update
      if (
        message &&
        message.source === 'requestai:extension' &&
        message.action === 'updateConfig'
      ) {
        config = message.config;

        // Update the interceptor with the new rules
        interceptor.updateRules(config.requestRules, config.responseRules);

        console.log('RequestAI: Updated rules', config);
      }
    },
    false
  );

  // Notify the extension that we're ready
  window.top.postMessage(
    {
      source: 'requestai:client',
      action: 'pageScriptInitialized',
    },
    window.location.href
  );
})();
