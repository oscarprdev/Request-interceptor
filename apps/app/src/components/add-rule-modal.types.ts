interface AddRuleModalEmits {
  (e: 'success', ruleId: number): void;
  (e: 'close'): void;
}

interface AddRuleModalProps {
  isOpen: boolean;
}

export { type AddRuleModalEmits, type AddRuleModalProps };
