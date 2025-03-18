import { API_URL } from '@/constants';
import type { CreateCollectionInput, DeleteCollectionInput } from './collection-mutations.types';

export const collectionsMutations = {
  createCollection: async (input: CreateCollectionInput) => {
    if (!input.userId) {
      throw new Error('User ID is required');
    }

    const response = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: input.userId,
      },
      body: JSON.stringify(input),
    });

    return await response.json();
  },

  deleteCollection: async ({ collectionId, userId }: DeleteCollectionInput) => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await fetch(`${API_URL}/collections/${collectionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: userId,
      },
    });

    return await response.json();
  },
};
