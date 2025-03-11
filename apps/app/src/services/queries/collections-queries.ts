import type { Collection } from '@/models/Collection';
import { API_URL } from '../common';

export const collectionsQueries = {
  getCollections: async (): Promise<Collection[]> => {
    const response = await fetch(`${API_URL}/collections`);
    const data = await response.json();
    return data.data;
  },
};
