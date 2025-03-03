import { IRuleRepository } from '@/interfaces/repositories/IRuleRepository';
import { IRuleService } from '@/interfaces/services/IRuleService';
import Rule from '@/models/Rule';
import { RuleRepository } from '@/repositories/ruleRepository';

export class RuleService implements IRuleService {
  constructor(private readonly ruleRepository: IRuleRepository) {}

  /**
   * Get all rules
   */
  async getAllRules(): Promise<Rule[]> {
    return this.ruleRepository.findAll();
  }

  /**
   * Get rule by ID
   */
  async getRuleById(id: number): Promise<Rule | null> {
    return this.ruleRepository.findById(id);
  }

  /**
   * Create a new rule
   */
  async createRule(ruleData: any): Promise<Rule> {
    return this.ruleRepository.create(ruleData);
  }

  /**
   * Update a rule
   */
  async updateRule(id: number, ruleData: any): Promise<Rule | null> {
    return this.ruleRepository.update(id, ruleData);
  }

  /**
   * Delete a rule
   */
  async deleteRule(id: number): Promise<boolean> {
    return this.ruleRepository.delete(id);
  }

  /**
   * Get rules by user ID
   */
  async getRulesByUserId(userId: number): Promise<Rule[]> {
    return this.ruleRepository.findByUserId(userId);
  }

  /**
   * Seed default rule
   */
  async seedDefaultRule(): Promise<Rule> {
    const defaultRule = {
      priority: 1,
      condition: {
        urlFilter: 'localhost:3000/example',
        resourceTypes: ['xmlhttprequest'],
        requestMethods: ['get', 'post', 'delete'],
      },
      action: {
        type: 'redirect',
        redirect: {
          url:
            'data:application/json;base64,' +
            Buffer.from(
              JSON.stringify({
                message:
                  'This is a mocked response for both GET and POST requests from the extension',
              })
            ).toString('base64'),
        },
      },
    };

    return this.ruleRepository.create(defaultRule);
  }
}

// Export a singleton instance with dependency injection
export const ruleService = new RuleService(new RuleRepository());
