type DropdownOption = {
  id: string;
  value: string;
  label: string;
};

type DropdownProps = {
  options: DropdownOption[];
  defaultSelected?: DropdownOption;
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string;
};

type DropdownEmits = {
  (e: 'change', id: string): void;
};

export type { DropdownOption, DropdownProps, DropdownEmits };
