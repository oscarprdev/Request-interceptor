import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/trpc';

// Create the tRPC client with debugging
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
      fetch: async (url, options) => {
        try {
          const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              ...options?.headers,
              'Content-Type': 'application/json',
            },
          });
          const jsonResponse = await response.json();
          return jsonResponse[0].result.data[0];
        } catch (error) {
          console.error('tRPC fetch error:', error);
          throw error;
        }
      },
    }),
  ],
});
