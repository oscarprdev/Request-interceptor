import { API_URL } from '../common';

export const rulesQueries = {
  getRules: async ({ collectionId }: { collectionId: string }) => {
    const response = await fetch(`${API_URL}/collections/${collectionId}/rules`);
    const data = await response.json();
    return data;
  },
};
