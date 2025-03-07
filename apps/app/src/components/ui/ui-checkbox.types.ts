interface CheckboxProps {
  modelValue: boolean;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

interface CheckboxEmits {
  'update:modelValue': [value: boolean];
  change: [value: boolean];
}

export type { CheckboxProps, CheckboxEmits };
