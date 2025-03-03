import Rule from '@/models/Rule';

export interface IRuleRepository {
  findAll(): Promise<Rule[]>;
  findById(id: number): Promise<Rule | null>;
  create(ruleData: {
    priority: number;
    urlFilter: string;
    resourceTypes: string[];
    requestMethods: string[];
    actionType: string;
    redirectUrl?: string;
  }): Promise<Rule>;
  update(id: number, ruleData: {
    priority?: number;
    urlFilter?: string;
    resourceTypes?: string[];
    requestMethods?: string[];
    actionType?: string;
    redirectUrl?: string;
  }): Promise<Rule | null>;
  delete(id: number): Promise<boolean>;
  findByUserId(userId: number): Promise<Rule[]>;
  seedDefaultRule(): Promise<Rule>;
}
