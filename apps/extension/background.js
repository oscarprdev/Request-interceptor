const config = {
  logRequests: true,
  logResponses: true,
  filterUrls: ['<all_urls>'],
  excludeTypes: ['image', 'font'], // Optionally exclude noisy request types
};

// Helper function to format request details
const formatRequestDetails = details => ({
  url: details.url,
  method: details.method || 'GET',
  type: details.type,
  timeStamp: new Date(details.timeStamp).toISOString(),
  tabId: details.tabId,
  frameId: details.frameId,
});

// Helper function to format response details
const formatResponseDetails = details => ({
  url: details.url,
  statusCode: details.statusCode,
  statusLine: details.statusLine,
  timeStamp: new Date(details.timeStamp).toISOString(),
  fromCache: details.fromCache,
  ip: details.ip,
});

// Listen for web requests
if (config.logRequests) {
  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      if (config.excludeTypes.includes(details.type)) return;

      // Log the request details
      console.log('HTTP Request:', formatRequestDetails(details));
    },
    { urls: config.filterUrls }
  );
}
