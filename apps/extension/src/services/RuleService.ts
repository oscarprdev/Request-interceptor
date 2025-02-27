import { Rule, RuleCreateDTO, RuleUpdateDTO } from '../models/Rule';

export class RuleService {
  private rules: Rule[] = [];
  private static instance: RuleService;
  private storageKey = 'userRules';

  public static getInstance(): RuleService {
    if (!RuleService.instance) {
      RuleService.instance = new RuleService();
    }
    return RuleService.instance;
  }

  public async initialize(): Promise<void> {
    await this.loadRules();
    console.log('RuleService initialized with', this.rules.length, 'rules');
  }

  public getRules(): Rule[] {
    return [...this.rules];
  }

  public getRule(id: number): Rule | undefined {
    return this.rules.find(rule => rule.id === id);
  }

  public async createRule(ruleData: RuleCreateDTO): Promise<Rule> {
    const newId = this.getNextId();

    const rule: Rule = {
      ...ruleData,
      id: newId,
    };

    this.rules.push(rule);
    await this.saveRules();
    await this.updateDynamicRules();

    return rule;
  }

  public async updateRule(id: number, ruleData: RuleUpdateDTO): Promise<Rule | null> {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index === -1) {
      return null;
    }

    const updatedRule: Rule = {
      ...this.rules[index],
      ...ruleData,
    };

    this.rules[index] = updatedRule;
    await this.saveRules();
    await this.updateDynamicRules();

    return updatedRule;
  }

  public async deleteRule(id: number): Promise<boolean> {
    const initialLength = this.rules.length;
    this.rules = this.rules.filter(rule => rule.id !== id);

    if (this.rules.length === initialLength) {
      return false;
    }

    await this.saveRules();
    await this.updateDynamicRules();

    return true;
  }

  private async updateDynamicRules(): Promise<void> {
    try {
      const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
      const currentRuleIds = currentRules.map(rule => rule.id);

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: currentRuleIds,
        addRules: this.rules,
      });
    } catch (error) {
      console.error('Error updating dynamic rules:', error);
    }
  }

  private async loadRules(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(this.storageKey);
      this.rules = data[this.storageKey] || [];
    } catch (error) {
      console.error('Error loading rules from storage:', error);
      this.rules = [];
    }
  }

  private async saveRules(): Promise<void> {
    try {
      await chrome.storage.local.set({ [this.storageKey]: this.rules });
    } catch (error) {
      console.error('Error saving rules to storage:', error);
    }
  }

  private getNextId(): number {
    return this.rules.length > 0 ? Math.max(...this.rules.map(rule => rule.id)) + 1 : 1;
  }
}

export const ruleService = RuleService.getInstance();
