import type { Rule } from '@/models/Rule';

export type GetRulesByCollectionIdResponse = {
  data: Rule[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type GetRulesByCollectionIdInput = {
  collectionId: string;
};
