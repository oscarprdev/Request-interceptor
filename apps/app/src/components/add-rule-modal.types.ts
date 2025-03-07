interface AddRuleModalEmits {
  (e: 'success', id: string): void;
  (e: 'close'): void;
}

interface AddRuleModalProps {
  isOpen: boolean;
}

export { type AddRuleModalEmits, type AddRuleModalProps };
