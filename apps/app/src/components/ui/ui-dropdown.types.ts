type DropdownOption = {
  id: string;
  value: string;
  label: string;
};

type DropdownProps = {
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string;
};

type DropdownEmits = {
  'update:modelValue': [value: string];
  change: [option: DropdownOption];
};

export type { DropdownOption, DropdownProps, DropdownEmits };
