import Collection, { CollectionInput } from '@/models/Collection';
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

export interface ICollectionRepository {
  // Collection CRUD
  findAll(): Promise<Collection[]>;
  findById(id: string): Promise<Collection | null>;
  create(collectionData: CollectionInput): Promise<Collection>;
  update(id: string, collectionData: Partial<CollectionInput>): Promise<Collection | null>;
  delete(id: string): Promise<boolean>;

  // User-Collection relationships
  findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<Collection>>;
  assignCollectionToUser(userId: string, collectionId: string): Promise<boolean>;
  removeCollectionFromUser(userId: string, collectionId: string): Promise<boolean>;

  // Collection-Rule relationships
  findRulesByCollectionId(
    collectionId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Rule>>;
  assignRuleToCollection(collectionId: string, ruleId: string): Promise<boolean>;
  removeRuleFromCollection(collectionId: string, ruleId: string): Promise<boolean>;

  // Seed data
  seedDefaultCollection(): Promise<Collection>;
}
