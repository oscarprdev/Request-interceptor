import { getRules } from '../common/rules-store';

// Convert our internal rule format to the format expected by the content script
const formatRuleForContentScript = (rule) => {
  if (!rule.enabled) {
    return null;
  }
  
  // Extract URL patterns from rule sources
  const matches = rule.pairs?.flatMap(pair => 
    pair.source?.filters?.map(filter => filter.value) || []
  ).filter(Boolean);
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  if (rule.ruleType === 'REQUEST') {
    return {
      id: rule.id,
      name: rule.name,
      type: rule.pairs[0]?.request?.type || 'static',
      matches,
      value: rule.pairs[0]?.request?.value || '',
      code: rule.pairs[0]?.request?.value || '',
      enabled: true
    };
  } else if (rule.ruleType === 'RESPONSE') {
    return {
      id: rule.id,
      name: rule.name,
      type: rule.pairs[0]?.response?.type || 'static',
      matches,
      value: rule.pairs[0]?.response?.value || '',
      code: rule.pairs[0]?.response?.value || '',
      statusCode: rule.pairs[0]?.response?.statusCode,
      statusText: rule.pairs[0]?.response?.statusText,
      useOriginalResponse: rule.pairs[0]?.response?.useOriginalResponse !== false,
      mockOnError: rule.pairs[0]?.response?.mockOnError === true,
      enabled: true
    };
  }
  
  return null;
};

// Send rules to a specific tab
export const syncRulesToTab = async (tabId) => {
  if (!tabId) return;
  
  try {
    const rules = await getRules();
    
    // Format rules for content script
    const requestRules = [];
    const responseRules = [];
    
    rules.forEach(rule => {
      const formattedRule = formatRuleForContentScript(rule);
      if (formattedRule) {
        if (rule.ruleType === 'REQUEST') {
          requestRules.push(formattedRule);
        } else if (rule.ruleType === 'RESPONSE') {
          responseRules.push(formattedRule);
        }
      }
    });
    
    // Send rules to content script
    chrome.tabs.sendMessage(tabId, {
      source: 'requestai:extension',
      action: 'updateConfig',
      config: {
        requestRules,
        responseRules
      }
    });
  } catch (error) {
    console.error('Error syncing rules to tab:', error);
  }
};

// Sync rules to all tabs
export const syncRulesToAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    if (tab.id) {
      syncRulesToTab(tab.id);
    }
  }
};

// Listen for tab updates to sync rules
export const initRuleSyncService = () => {
  // Sync rules when a tab is updated
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      syncRulesToTab(tabId);
    }
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.source === 'requestai:client' && message.action === 'pageScriptInitialized') {
      if (sender.tab?.id) {
        syncRulesToTab(sender.tab.id);
      }
    }
    return true;
  });
}; 