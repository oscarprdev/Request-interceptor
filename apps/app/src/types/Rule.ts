export enum RuleActionType {
  BLOCK = 'block',
  REDIRECT = 'redirect',
  ALLOW = 'allow',
  UPGRADE_SCHEME = 'upgradeScheme',
  MODIFY_HEADERS = 'modifyHeaders',
  ALLOW_ALL_REQUESTS = 'allowAllRequests',
}

export interface Rule {
  id: number;
  priority: number;
  condition: {
    urlFilter: string;
  };
  action: {
    type: RuleActionType;
    redirect?: {
      url: string;
    };
    modifyHeaders?: {
      requestHeaders?: {
        name: string;
        value: string;
      }[];
      responseHeaders?: {
        name: string;
        value: string;
      }[];
    };
    requestResponse?: {
      statusCode?: number;
      body?: string;
      headers?: {
        name: string;
        value: string;
      }[];
    };
  };
}
