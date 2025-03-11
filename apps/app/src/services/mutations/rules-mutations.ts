import type { Rule } from '@/models/Rule';
import { API_URL } from '../common';

export const rulesMutations = {
  createRule: async ({ collectionId, rule }: { collectionId: string; rule: Rule }) => {
    const response = await fetch(`${API_URL}/collections/${collectionId}/rules`, {
      method: 'POST',
      body: JSON.stringify(rule),
    });
    const data = await response.json();
    console.log(data);
    return data;
  },
};
