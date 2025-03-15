interface RemoveRuleModalProps {
  isOpen: boolean;
  ruleId: string;
}

interface RemoveRuleModalEmits {
  (e: 'close'): void;
  (e: 'success'): void;
}

export type { RemoveRuleModalProps, RemoveRuleModalEmits };
