import { MESSAGE_TYPES } from './models/Rule';
import { ruleService } from './services/RuleService';

chrome.runtime.onInstalled.addListener(async () => {
  await ruleService.updateRules();
  console.log('Extension initialization complete');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_RULES_FROM_POPUP') {
    console.log('Received update rules request from popup');

    ruleService
      .updateRules()
      .then(() => {
        console.log('Rules updated successfully from popup request');
        sendResponse({ success: true, message: 'Rules updated successfully' });
      })
      .catch(error => {
        console.error('Error updating rules from popup request:', error);
        sendResponse({ success: false, message: 'Failed to update rules: ' + error.message });
      });

    return true;
  }
});

chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.UPDATE_RULES:
      await ruleService.updateRules();
      sendResponse({ success: true, message: 'Rules updated successfully' });
      return true;

    default:
      console.error('Unknown message type', message.type);
      break;
  }

  sendResponse({ success: false, message: 'Unknown message type' });
  return false;
});
