import { API_URL } from '../common';
import type {
  GetRulesByCollectionIdInput,
  GetRulesByCollectionIdResponse,
} from './rules-queries.types';

export const rulesQueries = {
  getRulesByCollectionId: async ({ collectionId }: GetRulesByCollectionIdInput) => {
    const response = await fetch(`${API_URL}/rules/collection/${collectionId}`);
    const data = await response.json();

    return data as GetRulesByCollectionIdResponse;
  },
};
