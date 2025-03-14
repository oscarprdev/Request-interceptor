import type { Rule, RuleApplication } from '@/models/Rule';
import { formatPgDate } from './dates';
import type { RuleToServer } from '@/services/mutations/rules-mutations.types';

export const mapRuleToApplication = (rule: Rule): RuleApplication => ({
  id: rule.id,
  title: rule.title,
  priority: rule.priority,
  urlFilter: rule.urlFilter,
  requestMethods: rule.requestMethods,
  isEnabled: rule.isEnabled,
  response: JSON.parse(atob(rule.redirectUrl?.split(',')[1] || '{}')),
  createdAt: formatPgDate(rule.createdAt),
  updatedAt: formatPgDate(rule.updatedAt),
});

export const mapRuleToServer = (rule: RuleApplication): RuleToServer => ({
  id: rule.id,
  title: rule.title,
  redirectUrl: 'data:application/json;base64,' + btoa(JSON.stringify(rule.response)),
  requestMethods: rule.requestMethods,
  urlFilter: rule.urlFilter,
  isEnabled: rule.isEnabled ?? false,
  priority: rule.priority ?? 1,
});
