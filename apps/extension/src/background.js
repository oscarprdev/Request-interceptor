import { ruleService } from './services/RuleService';

// Initialize the extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed, initializing services');

  // Initialize the rule service
  await ruleService.initialize();

  // Add a default rule if no rules exist
  const rules = ruleService.getRules();
  if (rules.length === 0) {
    await ruleService.createRule({
      priority: 1,
      condition: {
        urlFilter: 'localhost:3000/example',
        resourceTypes: ['xmlhttprequest'],
        requestMethods: ['get', 'post', 'delete'],
      },
      action: {
        type: 'redirect',
        redirect: {
          url:
            'data:application/json;base64,' +
            btoa(
              JSON.stringify({
                message:
                  'This is a mocked response for both GET and POST requests from the extension',
              })
            ),
        },
      },
    });
  }

  console.log('Extension initialization complete');
});

// For debugging: Log when a rule is matched
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(({ request, rule }) => {
  console.log('Rule matched:', rule);
  console.log('Request:', request);
});

// Listen for storage changes to update rules
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === 'local' && changes.userRules) {
    console.log('Rules updated in storage, reinitializing service');
    await ruleService.initialize();
  }
});

// Add message handlers for communication with popup/options pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getRules') {
    const rules = ruleService.getRules();
    sendResponse({ success: true, rules });
    return true;
  }

  if (message.type === 'createRule') {
    ruleService
      .createRule(message.rule)
      .then(rule => sendResponse({ success: true, rule }))
      .catch(error => sendResponse({ success: false, error: error.toString() }));
    return true;
  }

  if (message.type === 'updateRule') {
    ruleService
      .updateRule(message.id, message.rule)
      .then(rule => sendResponse({ success: true, rule }))
      .catch(error => sendResponse({ success: false, error: error.toString() }));
    return true;
  }

  if (message.type === 'deleteRule') {
    ruleService
      .deleteRule(message.id)
      .then(success => sendResponse({ success }))
      .catch(error => sendResponse({ success: false, error: error.toString() }));
    return true;
  }

  return false;
});
