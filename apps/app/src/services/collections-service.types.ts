export interface CreateCollectionInput {
  name: string;
  description: string;
}

export interface UpdateCollectionInput {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}
