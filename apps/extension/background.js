const config = {
  logRequests: true,
  logResponses: true,
  filterUrls: ['<all_urls>'],
  excludeTypes: ['image', 'font'],
};

const formatRequestDetails = details => ({
  url: details.url,
  method: details.method || 'GET',
  type: details.type,
  timeStamp: new Date(details.timeStamp).toISOString(),
  tabId: details.tabId,
  frameId: details.frameId,
});

const formatResponseDetails = details => ({
  url: details.url,
  statusCode: details.statusCode,
  statusLine: details.statusLine,
  timeStamp: new Date(details.timeStamp).toISOString(),
  fromCache: details.fromCache,
  ip: details.ip,
});

const initFetchInterceptor = () => {
  const originalFetch = fetch;

  fetch = async (resource, initOptions = {}) => {
    const url = typeof resource === 'string' ? resource : resource.url;

    if (url === 'http://localhost:5173/example') {
      const mockedResponse = {
        message: 'This is a mocked response',
      };

      return new Response(JSON.stringify(mockedResponse), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return originalFetch(resource, initOptions);
  };
};

chrome.runtime.onInstalled.addListener(async () => {
  await setupDynamicRules();
});

async function setupDynamicRules() {
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3], // Remove rules with these IDs if they exist
    });

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              transform: { scheme: 'https', host: 'example.com', path: '/api/mock' },
            },
          },
          condition: {
            urlFilter: 'localhost:3000/example',
            resourceTypes: ['xmlhttprequest'],
          },
        },
        {
          id: 2,
          priority: 2,
          action: {
            type: 'modifyHeaders',
            responseHeaders: [
              { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
            ],
          },
          condition: {
            urlFilter: 'example.com/api/mock',
            resourceTypes: ['xmlhttprequest'],
          },
        },
      ],
      removeRuleIds: [1, 2],
    });
  } catch (error) {
    console.error('Error setting up dynamic rules:', error);
  }
}

chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(({ request, rule }) => {
  console.log('Rule matched:', rule.id);
  console.log('Request:', request.url);
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    console.log('Request intercepted:', details.url);

    if (details.url.includes('localhost:3000/example')) {
      console.log('Target request detected:', details);
    }
  },
  { urls: ['<all_urls>'] }
);

chrome.webRequest.onCompleted.addListener(
  details => {
    if (
      details.url.includes('localhost:3000/example') ||
      details.url.includes('example.com/api/mock')
    ) {
      console.log('Response completed:', {
        url: details.url,
        statusCode: details.statusCode,
        statusLine: details.statusLine,
        fromCache: details.fromCache,
      });
    }
  },
  { urls: ['<all_urls>'] }
);
