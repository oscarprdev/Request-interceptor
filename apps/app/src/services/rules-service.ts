import { trpc } from '../trpc';

// Helper function to check server connectivity
const checkServerConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:8080/health');
    return response.ok;
  } catch (error) {
    console.error('Server connectivity check failed:', error);
    return false;
  }
};

export const rulesService = {
  getRules: async () => {
    try {
      // Check server connectivity first
      const isServerAvailable = await checkServerConnectivity();
      if (!isServerAvailable) {
        throw new Error('Server is not available. Please check if the server is running.');
      }

      const rules = await trpc.getRules.query();
      return rules;
    } catch (error) {
      console.error('Error fetching rules:', error);
      throw error;
    }
  },

  getRuleById: async (id: number) => {
    try {
      const rule = await trpc.getRuleById.query({ id });
      return rule;
    } catch (error) {
      console.error(`Error fetching rule with id ${id}:`, error);
      throw error;
    }
  },

  createRule: async (ruleData: {
    priority: number;
    urlFilter: string;
    resourceTypes: string[];
    requestMethods: string[];
    actionType: string;
    redirectUrl?: string | null;
  }) => {
    try {
      const rule = await trpc.createRule.mutate(ruleData);
      return rule;
    } catch (error) {
      console.error('Error creating rule:', error);
      throw error;
    }
  },
};
