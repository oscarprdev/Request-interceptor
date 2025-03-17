export interface Rule {
  id: number;
  priority: number;
  condition: {
    urlFilter: string;
    resourceTypes: chrome.declarativeNetRequest.ResourceType[];
    requestMethods?: chrome.declarativeNetRequest.RequestMethod[];
    domains?: string[];
    excludedDomains?: string[];
  };
  action: {
    type: chrome.declarativeNetRequest.RuleActionType;
    redirect?: {
      url?: string;
      transform?: {
        scheme?: string;
        host?: string;
        path?: string;
        queryTransform?: {
          removeParams?: string[];
          addOrReplaceParams?: { key: string; value: string }[];
        };
      };
    };
    requestHeaders?: chrome.declarativeNetRequest.ModifyHeaderInfo[];
    responseHeaders?: chrome.declarativeNetRequest.ModifyHeaderInfo[];
  };
}

export interface ServerRule {
  id: string;
  priority: number;
  urlFilter: string;
  resourceTypes: string[];
  requestMethods: string[];
  actionType: string;
  redirectUrl?: string | null;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MessageType = 'UPDATE_RULES';

export const MESSAGE_TYPES = {
  UPDATE_RULES: 'UPDATE_RULES',
  GET_USER: 'GET_USER',
} as const as Record<MessageType, MessageType>;

export type RuleCreateDTO = Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>;
export type RuleUpdateDTO = Partial<Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>>;
