import type { Collection } from '@/models/Collection';
import { API_URL } from '../common';
import type { Rule } from '@/models/Rule';

export type GetRulesByCollectionIdResponse = {
  data: Rule[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export const collectionsQueries = {
  getCollections: async (): Promise<Collection[]> => {
    const response = await fetch(`${API_URL}/collections`);
    const data = await response.json();
    return data.data;
  },
  getRulesByCollectionId: async ({ collectionId }: { collectionId: string }) => {
    const response = await fetch(`${API_URL}/collections/${collectionId}/rules`);
    const data = await response.json();

    return data as GetRulesByCollectionIdResponse;
  },
};
