type BadgeVariant = 'default' | 'primary' | 'secondary' | 'tertiary' | 'destructive';
const BADGE_VARIANTS = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  destructive: 'destructive',
} as const satisfies Record<string, BadgeVariant>;

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
}

export { BADGE_VARIANTS, type BadgeProps };
