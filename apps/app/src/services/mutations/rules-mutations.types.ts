import type { Rule } from '@/models/Rule';

export type RuleToServer = Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateRuleInput = { rule: RuleToServer; collectionId: string };

export type UpdateRuleInput = { rule: RuleToServer; ruleId: string };
