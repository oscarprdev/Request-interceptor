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
    setSelectedRule(ruleId: string) {
      const rule = this.rules.find(rule => rule.id === ruleId);
      if (rule) {
        this.selectedRule = rule;
      }
    },
    updateRule(updatedRule: RuleApplication) {
      console.log(updatedRule);
      const index = this.rules.findIndex(rule => rule.id === updatedRule.id);
      if (index !== -1) {
        this.rules[index] = { ...this.rules[index], ...updatedRule };
      }
    },
    addRule(rule: RuleApplication) {
      this.rules.push(rule);
      this.selectedRule = rule;
    },
    deleteRule(ruleId: string) {
      this.rules = this.rules.filter(rule => rule.id !== ruleId);
    },
  },
});
