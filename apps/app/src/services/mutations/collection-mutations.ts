export interface CreateCollectionInput {
  name: string;
  description: string;
}

export const collectionMutations = {
  createCollection: async ({ name, description }: CreateCollectionInput) => {
    const response = await fetch('/api/v1/collections', {
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
