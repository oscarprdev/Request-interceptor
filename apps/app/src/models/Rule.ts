export interface Rule {
  id: number;
  priority: number;
  urlFilter: string;
  resourceTypes: string[];
  requestMethods: string[];
  actionType: string;
  redirectUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RuleApplication {
  id: number;
  priority: number;
  urlFilter: string;
  resourceTypes: string[];
  requestMethods: string[];
  actionType: string;
  response: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
