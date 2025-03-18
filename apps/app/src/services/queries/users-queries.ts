import type { User } from '@/models/User';
import { API_URL } from '@/constants';

export const usersQueries = {
  getUserById: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`);
    const data = await response.json();
    return data.data;
  },
  createUser: async (user: User) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data.data;
  },
};
