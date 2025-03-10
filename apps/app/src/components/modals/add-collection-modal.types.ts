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
  description: {
    value: string;
    error: string | null;
  };
}

const inputNameSchema = z.string().min(5);
const descriptionInputSchema = z.string().min(10);

const formStateSchema = z.object({
  name: inputNameSchema,
  description: descriptionInputSchema,
});

export {
  type AddCollectionModalProps,
  type AddCollectionModalEmits,
  type FormState,
  inputNameSchema,
  descriptionInputSchema,
  formStateSchema,
};
