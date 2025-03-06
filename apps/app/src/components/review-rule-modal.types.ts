import type { RuleApplication } from '@/models/Rule';

interface ReviewRuleModalEmits {
  (e: 'close'): void;
}

interface ReviewRuleModalProps {
  rule: RuleApplication | null;
}

export { type ReviewRuleModalEmits, type ReviewRuleModalProps };
