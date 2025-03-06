interface TextareaProps {
  modelValue: string;
  label: string;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  maxLength?: number;
}

interface TextareaEmits {
  (e: 'update', value: string): void;
}

export { type TextareaProps, type TextareaEmits };
