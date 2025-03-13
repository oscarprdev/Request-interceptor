import { API_URL } from '../common';
import type { CreateCollectionInput } from './collection-mutations.types';

export const collectionMutations = {
  createCollection: async ({ name, description }: CreateCollectionInput) => {
    const response = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, isEnabled: false }),
    });

    const data = await response.json();

    return data.data;
  },
};
