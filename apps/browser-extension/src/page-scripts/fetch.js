import {
  getAbsoluteUrl,
  isPromise,
  safeParseJSON,
  isContentTypeJSON,
  executeFunction,
  notifyExtension,
} from './utils';

export const initFetchInterceptor = debug => {
  // Store the original fetch function
  const originalFetch = window.fetch;

  // Replace the global fetch with our interceptor
  window.fetch = async (...args) => {
    const [resource, initOptions = {}] = args;

    // Function to call the original fetch
    const getOriginalResponse = () => originalFetch(...args);

    try {
      // Create a request object we can work with
      let request;
      if (resource instanceof Request) {
        request = resource.clone();
      } else {
        request = new Request(resource.toString(), initOptions);
      }

      const url = getAbsoluteUrl(request.url);
      const method = request.method;

      // Get request configuration from extension
      const config = window.requestaiConfig || {};
      const { requestRules, responseRules } = config;

      // Check if we have a matching request rule
      const requestRule = requestRules?.find(rule =>
        rule.matches?.some(pattern => url.includes(pattern))
      );

      // Apply request modifications if needed
      if (requestRule && !['GET', 'HEAD'].includes(method)) {
        const originalBody = await request.text();
        let modifiedBody = originalBody;

        if (requestRule.type === 'static') {
          modifiedBody = requestRule.value;
        } else if (requestRule.type === 'function') {
          const result = executeFunction(requestRule.code, {
            url,
            method,
            body: originalBody,
            bodyAsJson: safeParseJSON(originalBody),
          });

          if (result !== null) {
            modifiedBody = typeof result === 'object' ? JSON.stringify(result) : result;
          }
        }

        // Create a new request with the modified body
        request = new Request(request.url, {
          method,
          body: modifiedBody,
          headers: request.headers,
          referrer: request.referrer,
          referrerPolicy: request.referrerPolicy,
          mode: request.mode,
          credentials: request.credentials,
          cache: request.cache,
          redirect: request.redirect,
          integrity: request.integrity,
        });

        // Notify that we modified the request
        notifyExtension('request_modified', {
          url,
          method,
          originalBody,
          modifiedBody,
        });
      }

      // Check if we have a matching response rule
      const responseRule = responseRules?.find(rule =>
        rule.matches?.some(pattern => url.includes(pattern))
      );

      // If no response rule, just return the original fetch
      if (!responseRule) {
        return getOriginalResponse();
      }

      // Get the original response
      let originalResponse;
      try {
        originalResponse = await getOriginalResponse();

        // If the response rule requires the original response
        if (responseRule.useOriginalResponse) {
          const originalResponseData = await originalResponse.text();
          const contentType = originalResponse.headers.get('content-type');

          let modifiedResponse;

          if (responseRule.type === 'static') {
            modifiedResponse = responseRule.value;
          } else if (responseRule.type === 'function') {
            const result = executeFunction(responseRule.code, {
              url,
              method,
              response: originalResponseData,
              responseJson: isContentTypeJSON(contentType)
                ? safeParseJSON(originalResponseData)
                : null,
            });

            if (result !== null) {
              modifiedResponse = typeof result === 'object' ? JSON.stringify(result) : result;
            } else {
              // If the function returns null, use the original response
              return originalResponse;
            }
          }

          // Notify that we modified the response
          notifyExtension('response_modified', {
            url,
            method,
            originalResponse: originalResponseData,
            modifiedResponse,
          });

          // Create a new response with the modified data
          return new Response(new Blob([modifiedResponse]), {
            status: responseRule.statusCode || originalResponse.status,
            statusText: responseRule.statusText || originalResponse.statusText,
            headers: originalResponse.headers,
          });
        }
      } catch (error) {
        // If we can't get the original response but have a mock response rule,
        // we'll continue to serve the mock
        if (!responseRule.mockOnError) {
          return Promise.reject(error);
        }
      }

      // Create a mock response
      if (responseRule.type === 'static') {
        const contentType = isContentTypeJSON(responseRule.value)
          ? 'application/json'
          : 'text/plain';

        // Notify that we're serving a mock response
        notifyExtension('mock_response_served', {
          url,
          method,
          mockResponse: responseRule.value,
        });

        return new Response(new Blob([responseRule.value]), {
          status: responseRule.statusCode || 200,
          statusText: responseRule.statusText || 'OK',
          headers: new Headers({ 'content-type': contentType }),
        });
      }

      // If we get here, something went wrong
      debug && console.log('Requestai: Unable to process response rule', responseRule);
      return getOriginalResponse();
    } catch (err) {
      debug && console.error('Requestai fetch interceptor error:', err);
      return getOriginalResponse();
    }
  };
};
