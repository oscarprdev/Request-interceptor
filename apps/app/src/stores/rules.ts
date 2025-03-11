import type { RuleApplication } from '@/models/Rule';
import { defineStore } from 'pinia';

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [] as RuleApplication[],
    selectedRule: null as RuleApplication | null,
  }),
  actions: {
    setRules(rules: RuleApplication[]) {
      this.rules = rules;
    },
    setSelectedRule(rule: RuleApplication | null) {
      this.selectedRule = rule;
    },
    addRule(rule: RuleApplication) {
      this.rules.push(rule);
    },
    deleteRule(ruleId: string) {
      this.rules = this.rules.filter(rule => rule.id !== ruleId);
    },
  },
});
