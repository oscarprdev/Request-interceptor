export interface Rule {
  id: string;
  title: string;
  priority: number;
  urlFilter: string;
  resourceTypes: string[];
  requestMethods: string[];
  actionType: string;
  redirectUrl?: string | null;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum ActionType {
  BLOCK = 'block',
  REDIRECT = 'redirect',
}

export const ACTION_TYPES = Object.values(ActionType);

export interface RuleApplication {
  id: string;
  title: string;
  priority: number;
  urlFilter: string;
  requestMethods: string[];
  actionType: string;
  redirectUrl?: string | null;
  response?: Record<string, unknown>;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
