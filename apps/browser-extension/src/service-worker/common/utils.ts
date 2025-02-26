import { config } from './config';
import { STORAGE_KEYS } from '../../common/constants';
import { matchSourceUrl } from '../../common/rule-matcher';
import { ChangeType, getRecord, onRecordChange } from './storage';
import { SourceKey, SourceOperator, UrlSource } from '../../common/types';
import { getVariable, Variable } from './variable';

export const isExtensionEnabled = async (): Promise<boolean> => {
  return getVariable(Variable.IS_EXTENSION_ENABLED, true) as Promise<boolean>;
};

let cachedBlockedDomains: string[] = [];

export const cacheBlockedDomains = async () => {
  const blockedDomains = await getRecord<string[]>(STORAGE_KEYS.BLOCKED_DOMAINS);
  cachedBlockedDomains = blockedDomains ?? [];
};

export const getBlockedDomains = async () => {
  if (cachedBlockedDomains) {
    return cachedBlockedDomains;
  }

  await cacheBlockedDomains();
  return cachedBlockedDomains;
};

export const generateUrlPattern = (urlString: string) => {
  try {
    const webUrlObj = new URL(urlString);
    return `${webUrlObj.protocol}//${webUrlObj.host}/*`;
  } catch (error) {
    console.error(`Invalid URL: ${urlString}`, error);
    return null;
  }
};

export const onBlockListChange = (callback: () => void) => {
  onRecordChange<string[]>(
    {
      keyFilter: STORAGE_KEYS.BLOCKED_DOMAINS,
      changeTypes: [ChangeType.MODIFIED],
    },
    () => {
      cacheBlockedDomains().then(() => {
        callback?.();
      });
    }
  );
};

export const isUrlInBlockList = async (url: string) => {
  const blockedDomains = await getBlockedDomains();
  return blockedDomains?.some(domain => {
    return matchSourceUrl(
      {
        key: SourceKey.HOST,
        value: `/^(.+\.)?${domain}$/i`, // to match the domain and all its subdomains
        operator: SourceOperator.MATCHES,
      },
      url
    );
  });
};

// Url obj fails to construct when chrome:// or similar urls are passed
export const getUrlObject = (url: string | undefined): URL | null => {
  if (!url) {
    return null;
  }
  try {
    const urlObj = new URL(url);
    return urlObj;
  } catch (error) {
    return null;
  }
};

export const getAllSupportedWebURLs = () => {
  const webURLsSet = new Set([config.WEB_URL]);
  return [...webURLsSet];
};

export const isBlacklistedURL = (url: string | undefined): boolean => {
  if (!url) {
    return false;
  }

  const blacklistedSources: UrlSource[] = [
    ...getAllSupportedWebURLs().map(webUrl => ({
      key: SourceKey.URL,
      operator: SourceOperator.CONTAINS,
      value: webUrl,
    })),
    {
      key: SourceKey.URL,
      operator: SourceOperator.CONTAINS,
      value: '__rq', // you can use __rq in the url to blacklist it
    },
  ];

  return blacklistedSources.some(source => matchSourceUrl(source, url));
};
