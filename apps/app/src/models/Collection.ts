export interface Collection {
  id: string;
  name: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionInput {
  name: string;
  isEnabled?: boolean;
}

export interface CollectionApplication {
  id: string;
  name: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
