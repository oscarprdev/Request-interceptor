import Rule, { RuleInput } from '@/models/Rule';
import { PaginationOptions, PaginatedResult } from './ICollectionRepository';

export interface IRuleRepository {
  findAll(options?: PaginationOptions): Promise<PaginatedResult<Rule>>;
  findById(id: string): Promise<Rule | null>;
  create(ruleData: RuleInput): Promise<Rule>;
  update(id: string, ruleData: Partial<RuleInput>): Promise<Rule | null>;
  delete(id: string): Promise<boolean>;
  findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<Rule>>;
  findByCollectionId(collectionId: string): Promise<Rule[]>;
  seedDefaultRule(): Promise<Rule>;
}
