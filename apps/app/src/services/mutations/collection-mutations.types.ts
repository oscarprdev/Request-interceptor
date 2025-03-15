export interface CreateCollectionInput {
  id: string;
  isEnabled: boolean;
  name: string;
}

export interface DeleteCollectionInput {
  collectionId: string;
}
