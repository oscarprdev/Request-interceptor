import { syncRulesToAllTabs } from './services/rule-sync-service';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'rulesUpdated') {
    // Sync updated rules to all tabs
    syncRulesToAllTabs();
  }
  return true;
}); 