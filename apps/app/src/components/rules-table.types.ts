import type { RuleApplication } from '../models/Rule';

export interface RuleTableProps {
  rules: RuleApplication[];
  selectedRules: string[];
  loading: boolean;
}

export interface RuleTableEmits {
  'review-rule': [rule: RuleApplication];
  'rules-updated': [];
  'selection-change': [selectedIds: string[]];
}
