import Rule from '@/models/Rule';

export interface IRuleService {
  getAllRules(): Promise<Rule[]>;
  getRuleById(id: number): Promise<Rule | null>;
  getRulesByUserId(userId: number): Promise<Rule[]>;
  createRule(ruleData: any): Promise<Rule>;
  updateRule(id: number, ruleData: any): Promise<Rule | null>;
  deleteRule(id: number): Promise<boolean>;
  seedDefaultRule(): Promise<Rule>;
} 