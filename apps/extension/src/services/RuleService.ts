import { Rule, ServerRule } from '../models/Rule';

const API_URL = 'http://localhost:8080';

export class RuleService {
  public async updateRules(userToken: string): Promise<void> {
    const rules = await this.fetchRules(userToken);
    await this.updateDynamicRules(rules);
  }

  private async fetchRules(userToken: string): Promise<Rule[]> {
    try {
      const rulesResponse = await fetch(`${API_URL}/api/v1/rules`, {
        headers: {
          Authorization: `${userToken}`,
        },
      });
      const rules = await rulesResponse.json();

      return rules.data.map((rule: ServerRule, index: number) =>
        this.mapServerRuleToExtensionRule(rule, index)
      );
    } catch (error) {
      console.error('Error fetching rules from server:', error);
      return [];
    }
  }

  private async updateDynamicRules(rules: Rule[]): Promise<void> {
    try {
      const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
        removeRuleIds: currentRules.map(rule => rule.id),
      });
    } catch (error) {
      console.error('Error updating dynamic rules:', error);
    }
  }

  private mapServerRuleToExtensionRule(rule: ServerRule, index: number): Rule {
    const actionType = rule.isEnabled
      ? (rule.actionType as chrome.declarativeNetRequest.RuleActionType)
      : chrome.declarativeNetRequest.RuleActionType.ALLOW;

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
        type: actionType,
        redirect: {
          url: rule.redirectUrl ?? undefined,
        },
      },
    };
  }
}

export const ruleService = new RuleService();
