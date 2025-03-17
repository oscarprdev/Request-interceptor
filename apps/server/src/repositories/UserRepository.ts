import User from '@/models/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  getCollectionsByUserId(userId: string): Promise<string[]>;
  assignCollectionToUser(userId: string, collectionId: string): Promise<boolean>;
  removeCollectionFromUser(userId: string, collectionId: string): Promise<boolean>;
}
