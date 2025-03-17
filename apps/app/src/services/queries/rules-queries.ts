import { API_URL } from '../common';

import type { Rule } from '@/models/Rule';

export type GetRulesInput = {
  collectionId: string;
};

export type GetRulesByCollectionIdResponse = {
  data: Rule[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type GetRulesByCollectionIdInput = {
  userId: string;
  collectionId: string;
};

export const rulesQueries = {
  getRulesByCollectionId: async ({ userId, collectionId }: GetRulesByCollectionIdInput) => {
    const response = await fetch(`${API_URL}/rules/collection/${collectionId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userId,
      },
    });
    const data = await response.json();

    return data as GetRulesByCollectionIdResponse;
  },
};
