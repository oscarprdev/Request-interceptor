type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  destructive: 'destructive',
  ghost: 'ghost',
} as const satisfies Record<string, ButtonVariant>;

type ButtonSize = 'small' | 'medium' | 'large';
const BUTTON_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const satisfies Record<string, ButtonSize>;

type ButtonType = 'button' | 'submit' | 'reset';
const BUTTON_TYPES = {
  button: 'button',
  submit: 'submit',
  reset: 'reset',
} as const satisfies Record<string, ButtonType>;

interface ButtonProps {
  variant: ButtonVariant;
  disabled?: boolean;
  type?: ButtonType;
  size?: ButtonSize;
  fullWidth?: boolean;
}

interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}

export { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_TYPES, type ButtonProps, type ButtonEmits };
