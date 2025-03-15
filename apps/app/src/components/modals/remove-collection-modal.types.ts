export interface RemoveCollectionModalProps {
  isOpen: boolean;
  collectionId: string;
}

export interface RemoveCollectionModalEmits {
  (e: 'close'): void;
  (e: 'success'): void;
}
