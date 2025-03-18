import { updateExtensionRules } from '@/utils/update-extension-rules';
import { API_URL } from '@/constants';
import type { CreateRuleInput, DeleteRuleInput, UpdateRuleInput } from './rules-mutations.types';

export const rulesMutations = {
  createRule: async ({ rule, collectionId }: CreateRuleInput) => {
    const response = await fetch(`${API_URL}/rules/${collectionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });

    await updateExtensionRules();

    return await response.json();
  },
  updateRule: async ({ rule }: UpdateRuleInput) => {
    const response = await fetch(`${API_URL}/rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });

    await updateExtensionRules();

    return await response.json();
  },
  deleteRule: async ({ ruleId }: DeleteRuleInput) => {
    const response = await fetch(`${API_URL}/rules/${ruleId}`, {
      method: 'DELETE',
    });

    await updateExtensionRules();

    return await response.json();
  },
};
