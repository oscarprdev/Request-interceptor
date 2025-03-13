import Rule from '@/models/Rule';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RuleRepository {
  list(options?: PaginationOptions): Promise<PaginatedResult<Rule>>;
  describe(id: string): Promise<Rule | null>;
  create(rule: Rule): Promise<Rule>;
  update(rule: Rule): Promise<Rule | null>;
  delete(id: string): Promise<boolean>;
  listByCollectionId(
    collectionId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Rule>>;
}
