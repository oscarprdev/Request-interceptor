import { API_URL } from '../common';
import type { CreateRuleInput, UpdateRuleInput } from './rules-mutations.types';

export const rulesMutations = {
  createRule: async ({ rule, collectionId }: CreateRuleInput) => {
    const response = await fetch(`${API_URL}/rules/${collectionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });
    return await response.json();
  },
  updateRule: async ({ rule, ruleId }: UpdateRuleInput) => {
    const response = await fetch(`${API_URL}/rules/${ruleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });
    return await response.json();
  },
};
