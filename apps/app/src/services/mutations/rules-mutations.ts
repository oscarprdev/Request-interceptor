import type { Rule } from '@/models/Rule';
import { API_URL } from '../common';

export type RuleToServer = Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>;

export const rulesMutations = {
  createRule: async ({ rule, collectionId }: { collectionId: string; rule: RuleToServer }) => {
    const response = await fetch(`${API_URL}/rules/${collectionId}`, {
      method: 'POST',
      body: JSON.stringify(rule),
    });
    return await response.json();
  },
};
