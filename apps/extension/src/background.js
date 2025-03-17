import { MESSAGE_TYPES } from './models/Rule';
import { ruleService } from './services/RuleService';

const createUserToken = () => crypto.randomUUID();

const getUserToken = () => {
  let userToken = chrome.storage.local.get('requestick');
  if (!userToken) {
    userToken = createUserToken();
    chrome.storage.local.set({ requestick: userToken });
  }

  return userToken;
};

chrome.runtime.onInstalled.addListener(async () => {
  const userToken = getUserToken();

  await ruleService.updateRules(userToken);
  console.log('Extension initialization complete');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_RULES_FROM_POPUP') {
    console.log('Received update rules request from popup');

    const userToken = getUserToken();

    ruleService
      .updateRules(userToken)
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
      const userToken = localStorage.getItem('requestick');
      if (!userToken) return;

      await ruleService.updateRules(userToken);
      sendResponse({ success: true, message: 'Rules updated successfully' });
      return true;
    case MESSAGE_TYPES.GET_USER:
      chrome.storage.local.get(['requestick'], result => {
        let userId = result.requestick || '';
        if (!userId) {
          chrome.storage.local.set({ requestick: createUserToken() });
          userId = createUserToken();
        }

        sendResponse({ success: true, userId });
      });
      return true;

    default:
      console.error('Unknown message type', message.type);
      break;
  }

  sendResponse({ success: false, message: 'Unknown message type' });
  return false;
});
