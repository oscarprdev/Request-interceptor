export interface CreateCollectionInput {
  id: string;
  isEnabled: boolean;
  name: string;
  userId: string | null;
}

export interface DeleteCollectionInput {
  collectionId: string;
  userId: string | null;
}
