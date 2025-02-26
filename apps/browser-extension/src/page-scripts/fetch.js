import {
  getAbsoluteUrl,
  isPromise,
  safeParseJSON,
  isContentTypeJSON,
  executeFunction,
  notifyExtension,
} from './utils';

export const initFetchInterceptor = (debug) => {
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // Store rules
  let requestRules = [];
  let responseRules = [];
  
  // Function to update rules
  const updateRules = (newRequestRules, newResponseRules) => {
    requestRules = newRequestRules || [];
    responseRules = newResponseRules || [];
  };

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

      // Check if we have any request rules that match this URL
      const matchingRequestRule = requestRules.find(rule => 
        rule.enabled && rule.matches.some(pattern => url.includes(pattern))
      );

      // Apply request rule if found
      if (matchingRequestRule) {
        debug && console.log('RequestAI: Matched request rule', matchingRequestRule);
        
        // Clone the request to modify it
        const clonedRequest = request.clone();
        
        // Get the request body
        let requestBody = '';
        try {
          requestBody = await clonedRequest.text();
        } catch (e) {
          debug && console.error('RequestAI: Error reading request body', e);
        }
        
        // Parse JSON body if possible
        let bodyAsJson = null;
        if (isContentTypeJSON(clonedRequest.headers.get('content-type'))) {
          bodyAsJson = safeParseJSON(requestBody);
        }
        
        // Apply the rule
        let modifiedBody = requestBody;
        
        if (matchingRequestRule.action === 'static') {
          // Use static value
          modifiedBody = matchingRequestRule.value;
        } else if (matchingRequestRule.action === 'function') {
          // Execute custom function
          const fn = executeFunction(matchingRequestRule.code);
          if (typeof fn === 'function') {
            const result = fn({
              url,
              method,
              headers: Object.fromEntries(clonedRequest.headers.entries()),
              body: requestBody,
              bodyAsJson
            });
            
            if (result !== null) {
              modifiedBody = result;
            }
          }
        }
        
        // Notify that we modified the request
        notifyExtension('request_modified', {
          url,
          method,
          originalBody: requestBody,
          modifiedBody
        });
        
        // Create new request with modified body
        const newInit = { ...initOptions, body: modifiedBody };
        args[1] = newInit;
      }

      // Make the actual fetch request
      const response = await getOriginalResponse();
      
      // Check if we have any response rules that match this URL
      const matchingResponseRule = responseRules.find(rule => 
        rule.enabled && rule.matches.some(pattern => url.includes(pattern))
      );
      
      // If no matching response rule, return the original response
      if (!matchingResponseRule) {
        return response;
      }
      
      debug && console.log('RequestAI: Matched response rule', matchingResponseRule);
      
      // Clone the response to read its body
      const originalResponse = response.clone();
      
      // Get the response body
      let originalResponseData = '';
      try {
        originalResponseData = await originalResponse.text();
      } catch (e) {
        debug && console.error('RequestAI: Error reading response body', e);
        
        // If we can't read the response and mockOnError is not enabled, return original
        if (!matchingResponseRule.mockOnError) {
          return response;
        }
      }
      
      // Apply the response rule
      let modifiedResponse = originalResponseData;
      
      if (matchingResponseRule.action === 'static') {
        // Use static value
        modifiedResponse = matchingResponseRule.value;
      } else if (matchingResponseRule.action === 'function') {
        // Execute custom function
        const fn = executeFunction(matchingResponseRule.code);
        if (typeof fn === 'function') {
          // Parse JSON body if possible
          let responseJson = null;
          if (isContentTypeJSON(originalResponse.headers.get('content-type'))) {
            responseJson = safeParseJSON(originalResponseData);
          }
          
          const result = fn({
            url,
            method,
            status: originalResponse.status,
            headers: Object.fromEntries(originalResponse.headers.entries()),
            body: originalResponseData,
            responseJson
          });
          
          if (result !== null) {
            modifiedResponse = typeof result === 'object' ? JSON.stringify(result) : result;
          } else {
            // If the function returns null, use the original response
            return originalResponse;
          }
        }
      }
      
      // Notify that we modified the response
      notifyExtension('response_modified', {
        url,
        method,
        originalResponse: originalResponseData,
        modifiedResponse
      });
      
      // Create a new response with the modified data
      return new Response(new Blob([modifiedResponse]), {
        status: matchingResponseRule.statusCode || originalResponse.status,
        statusText: matchingResponseRule.statusText || originalResponse.statusText,
        headers: originalResponse.headers
      });
      
    } catch (err) {
      debug && console.error('RequestAI: Fetch interceptor error', err);
      return getOriginalResponse();
    }
  };
  
  // Return methods to control the interceptor
  return {
    updateRules
  };
};
