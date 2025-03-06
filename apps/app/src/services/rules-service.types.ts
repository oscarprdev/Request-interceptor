import type { RuleApplication } from '@/models/Rule';

export interface CreateRuleInput {
  urlFilter: string;
  requestMethods: string[];
  response: Record<string, unknown>;
}

export interface UpdateRuleInput {
  rule: RuleApplication;
}
