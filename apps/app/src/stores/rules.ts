import { defineStore } from 'pinia';

type StoreRule = {
  id: string;
  name: string;
  method: string;
};

export const useRulesStore = defineStore('rules', {
  state: () => ({
    rules: [] as StoreRule[],
  }),
  actions: {
    setRules(rules: StoreRule[]) {
      this.rules = rules;
    },
    addRule(rule: StoreRule) {
      this.rules.push(rule);
    },
    deleteRule(ruleId: string) {
      this.rules = this.rules.filter(rule => rule.id !== ruleId);
    },
  },
});
