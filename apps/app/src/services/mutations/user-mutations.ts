import { API_URL } from '@/constants';

export const userMutations = {
  createUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    return data.data;
  },
};
