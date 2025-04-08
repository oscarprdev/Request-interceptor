import type { RuleApplication } from '@/models/Rule';
import { defineStore } from 'pinia';

interface RulesStoreState {
  rules: RuleApplication[];
  selectedRule: RuleApplication | null;
}

export const useRulesStore = defineStore('rules', {
  state: (): RulesStoreState => ({
    rules: [],
    selectedRule: null,
  }),
  actions: {
    setRules(rules: RuleApplication[]) {
      this.rules = [...rules];
    },
    setSelectedRule(ruleId: string | null) {
      if (ruleId) {
        const rule = this.rules.find(rule => rule.id === ruleId);
        if (rule) {
          this.selectedRule = rule;
        }
      } else {
        this.selectedRule = null;
      }
    },
    updateRule(updatedRule: RuleApplication) {
      const index = this.rules.findIndex(rule => rule.id === updatedRule.id);
      if (index !== -1) {
        this.rules[index] = { ...this.rules[index], ...updatedRule };
      }
    },
    addRule(rule: RuleApplication) {
      this.selectedRule = rule;
      this.rules.push(rule);
    },
    deleteRule(ruleId: string) {
      this.rules = this.rules.filter(rule => rule.id !== ruleId);
    },
  },
});
