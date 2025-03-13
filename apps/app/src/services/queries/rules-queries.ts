import { API_URL } from '../common';
import type { GetRulesInput } from './rules-queries.types';

export const rulesQueries = {
  getRules: async ({ collectionId }: GetRulesInput) => {
    const response = await fetch(`${API_URL}/collections/${collectionId}/rules`);
    const data = await response.json();
    return data;
  },
};
