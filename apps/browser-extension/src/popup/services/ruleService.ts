import { Rule } from '../types/rule'

export const getRules = async (): Promise<Rule[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get('rules', (result) => {
      resolve(result.rules || [])
    })
  })
}

export const saveRule = async (rule: Rule): Promise<Rule> => {
  const rules = await getRules()
  const existingIndex = rules.findIndex(r => r.id === rule.id)
  
  let updatedRules: Rule[]
  if (existingIndex >= 0) {
    // Update existing rule
    updatedRules = [
      ...rules.slice(0, existingIndex),
      rule,
      ...rules.slice(existingIndex + 1)
    ]
  } else {
    // Add new rule
    updatedRules = [...rules, rule]
  }
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ rules: updatedRules }, () => {
      // Notify background script to sync rules
      chrome.runtime.sendMessage({ action: 'rulesUpdated' })
      resolve(rule)
    })
  })
}

export const deleteRule = async (ruleId: string): Promise<boolean> => {
  const rules = await getRules()
  const updatedRules = rules.filter(rule => rule.id !== ruleId)
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ rules: updatedRules }, () => {
      // Notify background script to sync rules
      chrome.runtime.sendMessage({ action: 'rulesUpdated' })
      resolve(true)
    })
  })
}

export const toggleRule = async (rule: Rule): Promise<Rule> => {
  const updatedRule = { ...rule, enabled: !rule.enabled }
  await saveRule(updatedRule)
  return updatedRule
} 