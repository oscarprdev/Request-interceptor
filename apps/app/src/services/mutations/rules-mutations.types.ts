import type { Rule } from '@/models/Rule';

export type RuleToServer = Omit<Rule, 'createdAt' | 'updatedAt' | 'resourceTypes' | 'actionType'>;

export type CreateRuleInput = { rule: RuleToServer; collectionId: string };

export type UpdateRuleInput = { rule: RuleToServer };

export interface DeleteRuleInput {
  ruleId: string;
}
