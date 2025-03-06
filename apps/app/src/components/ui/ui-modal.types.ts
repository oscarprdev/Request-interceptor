type ModalSize = 'small' | 'medium' | 'large' | 'full';
const MODAL_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  full: 'full',
} as const satisfies Record<string, ModalSize>;

interface ModalProps {
  title: string;
  isOpen: boolean;
  size?: ModalSize;
}

interface ModalEmits {
  (e: 'close'): void;
}

export { MODAL_SIZES, type ModalProps, type ModalEmits };
