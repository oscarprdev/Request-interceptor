const APP_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:8080';

let serverRulesCache = [];
let collectionsCache = [];
let currentCollectionId = null;

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container');
  const oldContent = container.innerHTML;

  container.innerHTML = `
    <header>
      <h1 id="popupTitle">Requestick</h1>
      <button id="refreshBtn" class="btn refresh-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20C9.76667 20 7.875 19.225 6.325 17.675C4.775 16.125 4 14.2333 4 12C4 9.76667 4.775 7.875 6.325 6.325C7.875 4.775 9.76667 4 12 4C13.15 4 14.25 4.2375 15.3 4.7125C16.35 5.1875 17.2333 5.86667 17.95 6.75V4H20V11H13V9H17.2C16.6333 8.03333 15.875 7.29167 14.925 6.775C13.975 6.25833 13 6 12 6C10.3333 6 8.91667 6.58333 7.75 7.75C6.58333 8.91667 6 10.3333 6 12C6 13.6667 6.58333 15.0833 7.75 16.25C8.91667 17.4167 10.3333 18 12 18C13.2833 18 14.4417 17.6333 15.475 16.9C16.5083 16.1667 17.2333 15.2 17.65 14H19.75C19.2833 15.8 18.3583 17.2583 16.975 18.375C15.5917 19.4917 13.9333 20 12 20Z" fill="currentColor"/>
        </svg>
        Refresh
      </button>
    </header>

    <div id="collectionsView" class="view">
      <div class="view-header">
        <h2>Collections <span id="collectionsCount" class="count-badge">0</span></h2>
      </div>
      <div id="collectionsList" class="list-container">
        <div class="loading">Loading collections...</div>
      </div>
      <div class="footer">
        <button id="newCollectionBtn" class="btn new-btn">New Collection</button>
      </div>
    </div>

    <div id="rulesView" class="view" style="display: none;">
      <div class="view-header">
        <button id="backToCollections" class="btn back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
          Back
        </button>
        <h2>Active Rules: <span id="rulesCount" class="count-badge">0</span></h2>
      </div>
      <div id="rulesList" class="list-container">
        <div class="loading">Select a collection to view rules</div>
      </div>
      <div class="footer">
        <button id="newRuleBtn" class="btn new-btn">New Rule</button>
      </div>
    </div>
  `;

  document.getElementById('refreshBtn').addEventListener('click', refreshCollections);
  document.getElementById('backToCollections').addEventListener('click', showCollectionsView);
  document.getElementById('newCollectionBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: APP_URL });
  });

  await refreshCollections();
});

async function refreshCollections() {
  const collectionsList = document.getElementById('collectionsList');
  collectionsList.innerHTML = '<div class="loading">Fetching collections from server...</div>';

  try {
    await chrome.runtime.sendMessage({ type: 'UPDATE_RULES_FROM_POPUP' });
    await loadCollections();
  } catch (error) {
    console.error('Error refreshing collections:', error);
    collectionsList.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
}

async function loadCollections() {
  const collectionsList = document.getElementById('collectionsList');
  const collectionsCount = document.getElementById('collectionsCount');

  try {
    const collections = await fetchCollections();
    collectionsCache = [...collections];

    collectionsCount.textContent = collectionsCache.length;

    if (collectionsCache.length === 0) {
      collectionsList.innerHTML = '<div class="no-items">No collections found</div>';
      return;
    }

    const collectionsHTMLPromises = collectionsCache.map(async collection => {
      const ruleCount = await fetchRuleCount(collection.id);
      return createCollectionElement(collection, ruleCount);
    });

    const collectionsHTML = (await Promise.all(collectionsHTMLPromises)).join('');
    collectionsList.innerHTML = collectionsHTML;

    document.querySelectorAll('.collection-item').forEach(item => {
      item.addEventListener('click', async () => {
        const collectionId = item.id;
        await selectCollection(collectionId);
      });
    });
  } catch (error) {
    console.error('Error loading collections:', error);
    collectionsList.innerHTML = `<div class="error">Error loading collections: ${error.message}</div>`;
  }
}

function createCollectionElement(collection, ruleCount) {
  return `
    <div class="collection-item" id="${collection.id}">
      <div class="collection-badge">COL</div>
      <div class="collection-name" title="${collection.name}">${collection.name}</div>
      <div class="rule-count">Rules: ${ruleCount}</div>
    </div>
  `;
}

async function selectCollection(collectionId) {
  currentCollectionId = collectionId;
  const collection = collectionsCache.find(c => c.id === collectionId);

  if (collection) {
    showRulesView();
    await loadRulesForCollection(collectionId);

    document.getElementById('newRuleBtn').addEventListener('click', () => {
      chrome.tabs.create({ url: `${APP_URL}/collections/${collectionId}` });
    });
  }
}

function showCollectionsView() {
  document.getElementById('collectionsView').style.display = 'block';
  document.getElementById('rulesView').style.display = 'none';
  document.getElementById('popupTitle').textContent = 'RequestTick';
}

function showRulesView() {
  document.getElementById('collectionsView').style.display = 'none';
  document.getElementById('rulesView').style.display = 'block';
}

async function loadRulesForCollection(collectionId) {
  const rulesList = document.getElementById('rulesList');
  const rulesCount = document.getElementById('rulesCount');

  rulesList.innerHTML = '<div class="loading">Loading rules...</div>';

  try {
    const rules = await fetchRulesByCollectionId(collectionId);
    serverRulesCache = [...rules];

    updateRulesCounter();

    if (serverRulesCache.length === 0) {
      rulesList.innerHTML = '<div class="no-items">No rules found in this collection</div>';
      return;
    }

    const rulesHTML = serverRulesCache.map(rule => createRuleElement(rule)).join('');

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

        const ruleItem = document.getElementById(ruleId);
        const enableState = document.getElementById(`enabled-state-${ruleId}`);

        try {
          await updateRuleEnabledState(ruleId, isEnabled);
          await chrome.runtime.sendMessage({ type: 'UPDATE_RULES_FROM_POPUP' });

          const ruleIndex = serverRulesCache.findIndex(r => r.id === ruleId);
          if (ruleIndex !== -1) {
            serverRulesCache[ruleIndex].isEnabled = isEnabled;
          }

          if (isEnabled) {
            ruleItem.classList.remove('rule-item--disabled');
            ruleItem.classList.add('rule-item--enabled');
            enableState.textContent = 'Active';
            ruleItem.style.transition = 'border-left-color 0.3s ease, opacity 0.3s ease';
          } else {
            ruleItem.classList.remove('rule-item--enabled');
            ruleItem.classList.add('rule-item--disabled');
            enableState.textContent = 'Inactive';
            ruleItem.style.transition = 'border-left-color 0.3s ease, opacity 0.3s ease';
          }

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

function updateRulesCounter() {
  const rulesCount = document.getElementById('rulesCount');
  const enabledRulesCount = serverRulesCache.filter(rule => rule.isEnabled).length;
  rulesCount.textContent = enabledRulesCount;

  if (enabledRulesCount > 0) {
    rulesCount.classList.remove('count-badge--zero');
  } else {
    rulesCount.classList.add('count-badge--zero');
  }
}

async function fetchCollections() {
  try {
    const userToken = await getUserToken();

    const response = await fetch(`${API_URL}/api/v1/collections`, {
      headers: {
        Authorization: userToken,
      },
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

async function fetchRulesByCollectionId(collectionId) {
  try {
    const userToken = await getUserToken();

    const response = await fetch(`${API_URL}/api/v1/rules/collection/${collectionId}`, {
      headers: {
        Authorization: userToken,
      },
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching rules for collection ${collectionId}:`, error);
    return [];
  }
}

async function updateRuleEnabledState(ruleId, isEnabled) {
  try {
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

    const userToken = await getUserToken();

    const response = await fetch(`${API_URL}/api/v1/rules`, {
      method: 'PUT',
      headers: {
        Authorization: userToken,
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

async function fetchRuleCount(collectionId) {
  try {
    const userToken = await getUserToken();

    const response = await fetch(`${API_URL}/api/v1/rules-collections/count/${collectionId}`, {
      headers: {
        Authorization: userToken,
      },
    });
    const data = await response.json();
    return data.success ? data.data : 0;
  } catch (error) {
    console.error(`Error fetching rule count for collection ${collectionId}:`, error);
    return 0;
  }
}

function createRuleElement(rule) {
  const urlFilter = rule.urlFilter || 'Not specified';
  const requestMethods = rule.requestMethods || ['get'];
  const isEnabled = rule?.isEnabled ?? false;

  const primaryMethod = requestMethods[0]?.toUpperCase() || 'GET';
  const badgeText = primaryMethod === 'DELETE' ? 'DEL' : primaryMethod;
  const methodClass = getMethodClass(primaryMethod);
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
        </div>
        <div class="expand-icon">▼</div>
      </div>
      <div class="rule-details">
        <div class="detail-group">
          <div class="detail-label">URL Filter:</div>
          <div class="detail-value">${urlFilter}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Status:</div>
          <div id='enabled-state-${rule.id}' class="detail-value">${isEnabled ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>
    </div>
  `;
}

// Helper function to get user token from chrome storage
function getUserToken() {
  return new Promise(resolve => {
    chrome.storage.local.get(['requestick'], result => {
      resolve(result.requestick || '');
    });
  });
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
