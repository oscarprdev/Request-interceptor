import { API_URL } from '@/constants';

export const rulesCollectionsQueries = {
  countRulesByCollection: async (collectionId: string): Promise<number> => {
    const response = await fetch(`${API_URL}/rules-collections/count/${collectionId}`);
    const data = await response.json();
    return data.data;
  },
};
