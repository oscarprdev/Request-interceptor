import type { Collection } from '@/models/Collection';
import { API_URL } from '@/constants';

export const collectionsQueries = {
  getCollections: async (userId: string): Promise<Collection[]> => {
    const response = await fetch(`${API_URL}/collections`, {
      headers: {
        Authorization: userId,
      },
    });
    const data = await response.json();
    return data.data;
  },
};
