export interface Rule {
  id: number;
  priority: number;
  condition: {
    urlFilter: string;
    resourceTypes: chrome.declarativeNetRequest.ResourceType[];
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

export type RuleCreateDTO = Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>;
export type RuleUpdateDTO = Partial<Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>>;
