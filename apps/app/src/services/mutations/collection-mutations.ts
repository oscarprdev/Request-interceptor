import { API_URL } from '@/services/common';
import type { CreateCollectionInput, DeleteCollectionInput } from './collection-mutations.types';

export const collectionsMutations = {
  createCollection: async (input: CreateCollectionInput) => {
    const response = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    return await response.json();
  },

  deleteCollection: async ({ collectionId }: DeleteCollectionInput) => {
    const response = await fetch(`${API_URL}/collections/${collectionId}`, {
      method: 'DELETE',
    });

    return await response.json();
  },
};
