import {
  generateUrlPattern,
  getBlockedDomains,
  isExtensionEnabled,
  onBlockListChange,
} from './common/utils';
import { onVariableChange, Variable } from './common/variable';

const generateBlockedHostMatchPattern = (host: string) => {
  return [`*://${host}/*`, `*://*.${host}/*`];
};

const CLIENT_SCRIPTS: chrome.scripting.RegisteredContentScript[] = [
  {
    id: 'page-script-ajaxInterceptor',
    js: ['page-scripts/ajaxRequestInterceptor.ps.js'],
    world: 'MAIN',
    allFrames: true,
    persistAcrossSessions: false,
    matches: ['http://*/*', 'https://*/*'],
    runAt: 'document_start',
  },
  {
    id: 'page-script-sessionRecorder',
    js: ['page-scripts/sessionRecorderHelper.ps.js'],
    world: 'MAIN',
    persistAcrossSessions: false,
    matches: ['http://*/*', 'https://*/*'],
    runAt: 'document_start',
  },
];

export const initClientHandler = async () => {
  console.log('initClientHandler');
  const isExtensionStatusEnabled = await isExtensionEnabled();
  setupClientScript(isExtensionStatusEnabled);

  onVariableChange<boolean>(Variable.IS_EXTENSION_ENABLED, extensionStatus => {
    console.log('[initClientHandler]', 'onVariableChange', { extensionStatus });
    setupClientScript(extensionStatus ?? false);
  });

  onBlockListChange(() => {
    unregisterClientScripts().then(() => {
      setupClientScript(isExtensionStatusEnabled);
    });
  });
};

const setupClientScript = async (isExtensionStatusEnabled: boolean) => {
  console.log('[initClientHandler.setupClientScript]', { isExtensionStatusEnabled });
  if (isExtensionStatusEnabled) {
    registerClientScripts();
  } else {
    unregisterClientScripts();
  }
};

const registerClientScripts = async () => {
  const blockedDomains = await getBlockedDomains();
  const blockedDomainPatterns = blockedDomains
    .flatMap(generateBlockedHostMatchPattern)
    .filter(pattern => !!pattern);

  console.log('[registerClientScript]', { blockedDomains });
  const clientScripts = CLIENT_SCRIPTS.map(script => {
    return {
      ...script,
      excludeMatches: [...(script.excludeMatches ?? []), ...blockedDomainPatterns],
    };
  });

  chrome.scripting
    .registerContentScripts(clientScripts)
    .then(() => {
      console.log('[registerClientScript]');
      chrome.scripting
        .getRegisteredContentScripts()
        .then(scripts =>
          console.log('[registerClientScript]', 'registered content scripts', scripts)
        );
    })
    .catch(err => console.warn('[unregisterClientScript]', 'unexpected error', err));
};

const unregisterClientScripts = async () => {
  console.log('[unregisterClientScript]');
  return chrome.scripting
    .unregisterContentScripts({ ids: CLIENT_SCRIPTS.map(script => script.id) })
    .then(() => {
      console.log('[unregisterClientScript]', 'unregisterClientScript complete');
      chrome.scripting
        .getRegisteredContentScripts()
        .then(scripts =>
          console.log('[unregisterClientScript]', 'registered content scripts', scripts)
        );
    })
    .catch(err => console.warn('[unregisterClientScript]', 'unexpected error', err));
};
