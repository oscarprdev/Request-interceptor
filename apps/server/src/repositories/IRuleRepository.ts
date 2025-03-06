import Rule, { RuleInput } from '@/models/Rule';

export interface IRuleRepository {
  findAll(): Promise<Rule[]>;
  findById(id: string): Promise<Rule | null>;
  create(ruleData: RuleInput): Promise<Rule>;
  update(id: string, ruleData: Partial<RuleInput>): Promise<Rule | null>;
  delete(id: string): Promise<boolean>;
  findByUserId(userId: string): Promise<Rule[]>;
  seedDefaultRule(): Promise<Rule>;
}
