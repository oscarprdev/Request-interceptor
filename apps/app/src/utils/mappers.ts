import type { Rule, RuleApplication } from '@/models/Rule';
import { formatPgDate } from './dates';
import type { RuleToServer } from '@/services/mutations/rules-mutations';

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

export const mapRuleToServer = (rule: RuleApplication): RuleToServer => ({
  redirectUrl: 'data:application/json;base64,' + btoa(JSON.stringify(rule.response)),
  requestMethods: rule.requestMethods,
  urlFilter: rule.urlFilter,
  resourceTypes: rule.resourceTypes,
  actionType: rule.actionType,
  priority: rule.priority ?? 3,
  isEnabled: rule.isEnabled ?? false,
});
