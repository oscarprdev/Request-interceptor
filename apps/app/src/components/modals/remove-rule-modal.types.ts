interface RemoveRuleModalProps {
  isOpen: boolean;
  ruleId: string;
}

interface RemoveRuleModalEmits {
  (e: 'close'): void;
}

export type { RemoveRuleModalProps, RemoveRuleModalEmits };
