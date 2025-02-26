export const STORAGE_TYPE = {
  LOCAL: 'local',
  SESSION: 'session',
} as const;

export const STORAGE_KEYS = {
  BLOCKED_DOMAINS: 'blockedDomains',
} as const;

export const EXTENSION_MESSAGES = {
  CLIENT_PAGE_LOADED: 'clientPageLoaded',
} as const;

export const CLIENT_MESSAGES = {
  NOTIFY_RULE_EXECUTED: 'notifyRuleExecuted',
};

export const PUBLIC_NAMESPACE = '__REQUESTAI__';
