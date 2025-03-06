type SwitchSize = 'small' | 'medium' | 'large';
const SWITCH_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const satisfies Record<string, SwitchSize>;

type SwitchColor = 'default' | 'primary' | 'secondary' | 'destructive';
const SWITCH_COLORS = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'destructive',
} as const satisfies Record<string, SwitchColor>;

interface SwitchProps {
  modelValue: boolean;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  size?: SwitchSize;
  color?: SwitchColor;
}

interface SwitchEmits {
  (e: 'change', value: boolean): void;
}

export { SWITCH_SIZES, SWITCH_COLORS, type SwitchProps, type SwitchEmits };
