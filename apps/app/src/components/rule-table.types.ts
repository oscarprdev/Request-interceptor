import type { RuleApplication } from "@/models/Rule";

interface RuleTableProps {
  rules: RuleApplication[];
  loading?: boolean;
}

interface RuleTableEmits {
  (e: 'review', rule: RuleApplication): void;
}

export { type RuleTableProps, type RuleTableEmits };
