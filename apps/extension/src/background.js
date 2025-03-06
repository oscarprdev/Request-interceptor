import { MESSAGE_TYPES } from './models/Rule';
import { ruleService } from './services/RuleService';

chrome.runtime.onInstalled.addListener(async () => {
  await ruleService.updateRules();

  console.log('Extension initialization complete');
});

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.UPDATE_RULES:
      ruleService.updateRules();
      sendResponse({ success: true, message: 'Rules updated successfully' });
      console.log('Rules updated successfully');
      return true;

    default:
      console.error('Unknown message type', message.type);
      break;
  }
  sendResponse({ success: false, message: 'Unknown message type' });
  return false;
});
