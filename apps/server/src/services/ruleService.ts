import { IRuleRepository } from '@/interfaces/repositories/IRuleRepository';
import { RuleRepository } from '@/repositories/ruleRepository';

export class RuleService {
  private ruleRepository: IRuleRepository;

  constructor(ruleRepository: IRuleRepository) {
    this.ruleRepository = ruleRepository;
  }

  /**
   * Get all rules
   */
  async getAllRules() {
    return this.ruleRepository.findAll();
  }

  /**
   * Get rule by ID
   */
  async getRuleById(id: number) {
    return this.ruleRepository.findById(id);
  }

  /**
   * Create a new rule
   */
  async createRule(ruleData: any) {
    return this.ruleRepository.create(ruleData);
  }

  /**
   * Update a rule
   */
  async updateRule(id: number, ruleData: any) {
    return this.ruleRepository.update(id, ruleData);
  }

  /**
   * Delete a rule
   */
  async deleteRule(id: number) {
    return this.ruleRepository.delete(id);
  }

  /**
   * Get rules by user ID
   */
  async getRulesByUserId(userId: number) {
    return this.ruleRepository.findByUserId(userId);
  }

  /**
   * Seed default rule
   */
  async seedDefaultRule() {
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
