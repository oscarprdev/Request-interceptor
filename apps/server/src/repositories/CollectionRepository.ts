import Collection from '@/models/Collection';

export interface CollectionRepository {
  list(userId?: string): Promise<Collection[]>;
  describe(id: string): Promise<Collection | null>;
  create(collection: Collection): Promise<Collection>;
  update(collection: Collection): Promise<Collection | null>;
  delete(id: string): Promise<boolean>;
}
