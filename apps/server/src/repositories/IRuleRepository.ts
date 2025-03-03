import Rule, { RuleInput } from '@/models/Rule';

export interface IRuleRepository {
  findAll(): Promise<Rule[]>;
  findById(id: number): Promise<Rule | null>;
  create(ruleData: RuleInput): Promise<Rule>;
  update(id: number, ruleData: Partial<RuleInput>): Promise<Rule | null>;
  delete(id: number): Promise<boolean>;
  findByUserId(userId: number): Promise<Rule[]>;
  seedDefaultRule(): Promise<Rule>;
}
