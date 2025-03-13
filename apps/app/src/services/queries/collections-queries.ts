import type { Collection } from '@/models/Collection';
import { API_URL } from '../common';
import type {
  GetRulesByCollectionIdInput,
  GetRulesByCollectionIdResponse,
} from './collections-queries.types';

export const collectionsQueries = {
  getCollections: async (): Promise<Collection[]> => {
    const response = await fetch(`${API_URL}/collections`);
    const data = await response.json();
    return data.data;
  },
  getRulesByCollectionId: async ({ collectionId }: GetRulesByCollectionIdInput) => {
    const response = await fetch(`${API_URL}/collections/${collectionId}/rules`);
    const data = await response.json();

    return data as GetRulesByCollectionIdResponse;
  },
};
