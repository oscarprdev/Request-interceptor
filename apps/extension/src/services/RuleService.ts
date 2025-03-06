import { Rule, ServerRule } from '../models/Rule';

export class RuleService {
  public async updateRules(): Promise<void> {
    const rules = await this.fetchRules();
    await this.updateDynamicRules(rules);
  }

  private async fetchRules(): Promise<Rule[]> {
    try {
      const rulesResponse = await fetch('http://localhost:8080/api/v1/rules');
      const rules = await rulesResponse.json();

      return rules.data
        .filter((rule: ServerRule) => !rule.isEnabled)
        .map(this.mapServerRuleToExtensionRule);
    } catch (error) {
      console.error('Error fetching rules from server:', error);
      return [];
    }
  }

  private async updateDynamicRules(rules: Rule[]): Promise<void> {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
        removeRuleIds: rules.map(rule => rule.id),
      });
    } catch (error) {
      console.error('Error updating dynamic rules:', error);
    }
  }

  private mapServerRuleToExtensionRule(rule: ServerRule, index: number): Rule {
    return {
      id: index + 1,
      priority: rule.priority,
      condition: {
        urlFilter: rule.urlFilter,
        resourceTypes: [...rule.resourceTypes] as chrome.declarativeNetRequest.ResourceType[],
        requestMethods: [...rule.requestMethods].map(method =>
          method.toLowerCase()
        ) as chrome.declarativeNetRequest.RequestMethod[],
      },
      action: {
        type: 'redirect' as chrome.declarativeNetRequest.RuleActionType,
        redirect: {
          url: rule.redirectUrl ?? undefined,
        },
      },
    };
  }
}

export const ruleService = new RuleService();
