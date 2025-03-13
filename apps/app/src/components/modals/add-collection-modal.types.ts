import { z } from 'zod';

interface AddCollectionModalProps {
  isOpen: boolean;
}

interface AddCollectionModalEmits {
  (e: 'close'): void;
}

interface FormState {
  name: {
    value: string;
    error: string | null;
  };
}

const inputNameSchema = z.string().min(5);

const formStateSchema = z.object({
  name: inputNameSchema,
});

export {
  type AddCollectionModalProps,
  type AddCollectionModalEmits,
  type FormState,
  inputNameSchema,
  formStateSchema,
};
