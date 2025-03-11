import type { Rule, RuleApplication } from '@/models/Rule';
import { formatPgDate } from './dates';

export const mapRuleToApplication = (rule: Rule): RuleApplication => ({
  id: rule.id,
  priority: rule.priority,
  urlFilter: rule.urlFilter,
  resourceTypes: rule.resourceTypes,
  requestMethods: rule.requestMethods,
  actionType: rule.actionType,
  isEnabled: rule.isEnabled,
  response: JSON.parse(atob(rule.redirectUrl?.split(',')[1] || '{}')),
  createdAt: formatPgDate(rule.createdAt),
  updatedAt: formatPgDate(rule.updatedAt),
});
