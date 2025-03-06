interface InputProps {
  modelValue: string;
  label: string;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

interface InputEmits {
  (e: 'update:modelValue', value: string): void;
}

export { type InputProps, type InputEmits };
