import type { Rule } from '@/models/Rule';
import { API_URL } from '@/constants';

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
    if (!response.ok) {
      throw new Error('Failed to fetch rules');
    }
    const data = await response.json();

    return data as GetRulesByCollectionIdResponse;
  },
};
