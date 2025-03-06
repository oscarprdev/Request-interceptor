interface AddRuleModalEmits {
  (e: 'success'): void;
  (e: 'close'): void;
}

interface AddRuleModalProps {
  isOpen: boolean;
}

export { type AddRuleModalEmits, type AddRuleModalProps };
