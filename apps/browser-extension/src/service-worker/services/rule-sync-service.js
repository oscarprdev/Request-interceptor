import { getRules } from '../common/rules-store';

// Convert our internal rule format to the format expected by the content script
const formatRuleForContentScript = rule => {
  if (!rule.enabled) {
    return null;
  }

  // Extract URL patterns from rule sources
  const matches = rule.pairs
    ?.flatMap(pair => pair.source?.filters?.map(filter => filter.value) || [])
    .filter(Boolean);

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
      enabled: true,
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
      enabled: true,
    };
  }

  return null;
};

/**
 * Syncs rules to all tabs
 */
export const syncRulesToAllTabs = async () => {
  // Get all tabs
  const tabs = await chrome.tabs.query({});

  // Get rules from storage
  const { rules = [] } = await chrome.storage.local.get('rules');

  // Separate rules by type
  const requestRules = rules.filter(rule => rule.type === 'request' && rule.enabled);
  const responseRules = rules.filter(rule => rule.type === 'response' && rule.enabled);

  // Send rules to each tab
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        source: 'requestai:extension',
        action: 'updateConfig',
        config: {
          requestRules,
          responseRules,
        },
      });
    } catch (error) {
      // Tab might not have content script loaded yet
      console.log(`Could not send rules to tab ${tab.id}:`, error);
    }
  }
};

/**
 * Syncs rules to a specific tab
 */
export const syncRulesToTab = async tabId => {
  // Get rules from storage
  const { rules = [] } = await chrome.storage.local.get('rules');

  // Separate rules by type
  const requestRules = rules.filter(rule => rule.type === 'request' && rule.enabled);
  const responseRules = rules.filter(rule => rule.type === 'response' && rule.enabled);

  // Send rules to the tab
  try {
    await chrome.tabs.sendMessage(tabId, {
      source: 'requestai:extension',
      action: 'updateConfig',
      config: {
        requestRules,
        responseRules,
      },
    });
  } catch (error) {
    // Tab might not have content script loaded yet
    console.log(`Could not send rules to tab ${tabId}:`, error);
  }
};

/**
 * Initialize the rule sync service
 */
export const initRuleSyncService = () => {
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      syncRulesToTab(tabId);
    }
  });

  // Listen for messages from content scripts
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (
      message.source === 'requestai:client' &&
      message.action === 'pageScriptInitialized' &&
      sender.tab
    ) {
      syncRulesToTab(sender.tab.id);
    }
    return true;
  });
};
