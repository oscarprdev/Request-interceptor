import Rule from '@/models/Rule';

export interface IRuleRepository {
  findAll(): Promise<Rule[]>;
  findById(id: number): Promise<Rule | null>;
  create(ruleData: any): Promise<Rule>;
  update(id: number, ruleData: any): Promise<Rule | null>;
  delete(id: number): Promise<boolean>;
  findByUserId(userId: number): Promise<Rule[]>;
}
