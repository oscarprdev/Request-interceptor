import { MESSAGE_TYPES } from './models/Rule';
import { ruleService } from './services/RuleService';

const createUserToken = () => crypto.randomUUID();

const getUserToken = () => {
  return new Promise(resolve => {
    chrome.storage.local.get(['requestick'], result => {
      if (result.requestick) {
        resolve(result.requestick);
      } else {
        const newToken = createUserToken();
        chrome.storage.local.set({ requestick: newToken }, () => {
          resolve(newToken);
        });
      }
    });
  });
};

chrome.runtime.onInstalled.addListener(async () => {
  const userToken = await getUserToken();
  await ruleService.updateRules(userToken);
  console.log('Extension initialization complete');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_RULES_FROM_POPUP') {
    console.log('Received update rules request from popup');

    getUserToken().then(userToken => {
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
    });

    return true;
  }
});

chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case MESSAGE_TYPES.UPDATE_RULES:
      const userToken = await getUserToken();
      await ruleService.updateRules(userToken);
      sendResponse({ success: true, message: 'Rules updated successfully' });
      return true;

    case MESSAGE_TYPES.GET_USER:
      chrome.storage.local.get(['requestick'], result => {
        let userId = result.requestick || '';
        if (!userId) {
          userId = createUserToken();
          chrome.storage.local.set({ requestick: userId });
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
