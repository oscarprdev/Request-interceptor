import type { Rule } from '@/models/Rule';

export type RuleToServer = Omit<
  Rule,
  'createdAt' | 'updatedAt' | 'resourceTypes' | 'actionType' | 'priority'
>;

export type CreateRuleInput = { rule: RuleToServer; collectionId: string };

export type UpdateRuleInput = { rule: RuleToServer };
