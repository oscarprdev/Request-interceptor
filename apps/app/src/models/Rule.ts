export interface Rule {
  id: string;
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

export interface RuleInput {
  urlFilter: string;
  requestMethods: string[];
  redirectUrl?: string | null;
  isEnabled?: boolean;
}

export interface RuleApplication {
  id: string;
  priority: number;
  urlFilter: string;
  requestMethods: string[];
  redirectUrl?: string | null;
  response?: Record<string, unknown>;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
