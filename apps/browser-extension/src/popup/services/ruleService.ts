import { Rule, RuleFormData } from '../types/rule';
import { v4 as uuidv4 } from 'uuid';

export const getRules = async (): Promise<Rule[]> => {
  return new Promise(resolve => {
    chrome.storage.local.get('rules', result => {
      resolve(result.rules || []);
    });
  });
};

export const saveRule = async (formData: RuleFormData): Promise<Rule> => {
  const rules = await getRules();

  // Create a new rule
  const newRule: Rule = {
    id: uuidv4(),
    name: formData.name,
    type: formData.type,
    matches: [formData.pattern],
    action: formData.action,
    value: formData.value,
    enabled: true,
    createdAt: new Date().toISOString(),
  };

  // Add to rules
  const updatedRules = [...rules, newRule];

  return new Promise(resolve => {
    chrome.storage.local.set({ rules: updatedRules }, () => {
      // Notify background script to sync rules
      chrome.runtime.sendMessage({ action: 'rulesUpdated' });
      resolve(newRule);
    });
  });
};

export const deleteRule = async (ruleId: string): Promise<boolean> => {
  const rules = await getRules();
  const updatedRules = rules.filter(rule => rule.id !== ruleId);

  return new Promise(resolve => {
    chrome.storage.local.set({ rules: updatedRules }, () => {
      // Notify background script to sync rules
      chrome.runtime.sendMessage({ action: 'rulesUpdated' });
      resolve(true);
    });
  });
};

export const toggleRule = async (rule: Rule): Promise<Rule> => {
  const rules = await getRules();
  const updatedRule = { ...rule, enabled: !rule.enabled };

  const updatedRules = rules.map(r => (r.id === rule.id ? updatedRule : r));

  return new Promise(resolve => {
    chrome.storage.local.set({ rules: updatedRules }, () => {
      // Notify background script to sync rules
      chrome.runtime.sendMessage({ action: 'rulesUpdated' });
      resolve(updatedRule);
    });
  });
};
