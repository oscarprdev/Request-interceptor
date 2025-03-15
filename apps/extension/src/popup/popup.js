document.addEventListener('DOMContentLoaded', async () => {
  const rulesList = document.getElementById('rulesList');
  rulesList.innerHTML = '<div class="loading">Fetching latest rules from server...</div>';

  try {
    await chrome.runtime.sendMessage({ type: 'UPDATE_RULES_FROM_POPUP' });
  } finally {
    await loadRules();
  }

  document.getElementById('newRuleBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173/' });
  });

  document.getElementById('refreshRules').addEventListener('click', async () => {
    try {
      const rulesList = document.getElementById('rulesList');
      rulesList.innerHTML = '<div class="loading">Updating rules from server...</div>';

      const response = await chrome.runtime.sendMessage({ type: 'UPDATE_RULES_FROM_POPUP' });

      if (response && response.success) {
        await loadRules();
      } else {
        throw new Error(response?.message || 'Failed to update rules');
      }
    } catch (error) {
      console.error('Error updating rules:', error);
      const rulesList = document.getElementById('rulesList');
      rulesList.innerHTML = `<div class="error">Error updating rules: ${error.message}</div>`;
    }
  });
});

// Store server rules globally so we can access them when updating
let serverRulesCache = [];

function updateRulesCounter() {
  const rulesCount = document.getElementById('rulesCount');
  // Count only enabled rules
  const enabledRulesCount = serverRulesCache.filter(rule => rule.isEnabled).length;
  rulesCount.textContent = enabledRulesCount;

  // Update the counter class based on whether there are enabled rules
  if (enabledRulesCount > 0) {
    rulesCount.classList.remove('rules-count--zero');
  } else {
    rulesCount.classList.add('rules-count--zero');
  }
}

async function loadRules() {
  const rulesList = document.getElementById('rulesList');
  const rulesCount = document.getElementById('rulesCount');

  rulesList.innerHTML = '<div class="loading">Loading rules...</div>';

  try {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const serverRules = await fetchServerRules();

    serverRulesCache = [...serverRules];

    // Update rules counter to show only enabled rules
    updateRulesCounter();

    if (serverRulesCache.length === 0) {
      rulesList.innerHTML = '<div class="no-rules">No rules found</div>';
      return;
    }

    const rulesHTML = serverRulesCache
      .map(rule => {
        return createRuleElement(rule);
      })
      .join('');

    rulesList.innerHTML = rulesHTML;

    document.querySelectorAll('.rule-header').forEach(header => {
      header.addEventListener('click', event => {
        if (event.target.closest('.rule-switch')) {
          return;
        }

        const ruleItem = header.closest('.rule-item');
        ruleItem.classList.toggle('expanded');
      });
    });

    document.querySelectorAll('.rule-switch input').forEach(switchInput => {
      switchInput.addEventListener('change', async event => {
        event.stopPropagation();
        const ruleId = event.target.id.replace('switch-', '');
        const isEnabled = event.target.checked;

        // Get the rule item element to update its class
        const ruleItem = document.getElementById(ruleId);

        try {
          await updateRuleEnabledState(ruleId, isEnabled);
          await chrome.runtime.sendMessage({ type: 'UPDATE_RULES_FROM_POPUP' });

          // Update the rule in our cache
          const ruleIndex = serverRulesCache.findIndex(r => r.id === ruleId);
          if (ruleIndex !== -1) {
            serverRulesCache[ruleIndex].isEnabled = isEnabled;
          }

          // Update the UI
          const switchLabel = switchInput.nextElementSibling;
          switchLabel.textContent = isEnabled ? 'Enabled' : 'Disabled';

          // Update the rule item class to show the enabled/disabled state visually
          if (isEnabled) {
            ruleItem.classList.remove('rule-item--disabled');
            ruleItem.classList.add('rule-item--enabled');

            // Add a subtle animation effect
            ruleItem.style.transition = 'border-left-color 0.3s ease, opacity 0.3s ease';
          } else {
            ruleItem.classList.remove('rule-item--enabled');
            ruleItem.classList.add('rule-item--disabled');

            // Add a subtle animation effect
            ruleItem.style.transition = 'border-left-color 0.3s ease, opacity 0.3s ease';
          }

          // Update rules counter
          updateRulesCounter();
        } catch (error) {
          console.error('Error updating rule:', error);
          event.target.checked = !isEnabled;
        }
      });
    });
  } catch (error) {
    console.error('Error loading rules:', error);
    rulesList.innerHTML = `<div class="error">Error loading rules: ${error.message}</div>`;
  }
}

async function fetchServerRules() {
  try {
    const response = await fetch('http://localhost:8080/api/v1/rules');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching server rules:', error);
    return [];
  }
}

async function updateRuleEnabledState(ruleId, isEnabled) {
  try {
    console.log({ serverRulesCache });
    const rule = serverRulesCache.find(r => r.id === ruleId);

    if (!rule) {
      throw new Error(`Rule with ID ${ruleId} not found in server data`);
    }

    const updatePayload = {
      id: rule.id,
      title: rule.title,
      priority: rule.priority,
      urlFilter: rule.urlFilter,
      requestMethods: rule.requestMethods,
      redirectUrl: rule.redirectUrl,
      isEnabled: isEnabled,
    };

    console.log(updatePayload);

    const response = await fetch('http://localhost:8080/api/v1/rules', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update rule: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating rule:', error);
    throw error;
  }
}

function createRuleElement(rule) {
  const urlFilter = rule.urlFilter || 'Not specified';
  const requestMethods = rule.requestMethods || ['get'];
  const isEnabled = rule?.isEnabled ?? false;

  const primaryMethod = requestMethods[0]?.toUpperCase() || 'GET';

  const badgeText = primaryMethod === 'DELETE' ? 'DEL' : primaryMethod;

  const methodClass = getMethodClass(primaryMethod);

  const methodsDisplay = requestMethods.map(m => m.toUpperCase()).join(', ') || 'All';

  // Add a class based on enabled state
  const ruleClass = isEnabled ? 'rule-item rule-item--enabled' : 'rule-item rule-item--disabled';

  return `
    <div class="${ruleClass}" id="${rule.id}">
      <div class="rule-header">
        <div class="method-badge ${methodClass}">${badgeText}</div>
        <div class="rule-summary">
          <div class="rule-url" title="${urlFilter}">${truncateText(urlFilter, 30)}</div>
        </div>
        <div class="rule-switch">
          <input 
            type="checkbox" 
            id="switch-${rule.id}" 
            class="switch-input" 
            ${isEnabled ? 'checked' : ''}>
          <span class="switch-status">${isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div class="expand-icon">▼</div>
      </div>
      <div class="rule-details">
        <div class="detail-group">
          <div class="detail-label">URL Filter:</div>
          <div class="detail-value">${urlFilter}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Methods:</div>
          <div class="detail-value">${methodsDisplay}</div>
        </div>
      </div>
    </div>
  `;
}

function getMethodClass(method) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'method-get';
    case 'POST':
      return 'method-post';
    case 'PUT':
      return 'method-put';
    case 'DELETE':
      return 'method-delete';
    default:
      return 'method-get';
  }
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}
