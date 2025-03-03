import { ruleRepository } from '../repositories/ruleRepository';

export const ruleService = {
  /**
   * Get all rules
   */
  async getAllRules() {
    return ruleRepository.findAll();
  },

  /**
   * Get rule by ID
   */
  async getRuleById(id: number) {
    return ruleRepository.findById(id);
  },

  /**
   * Create a new rule
   */
  async createRule(ruleData: any) {
    return ruleRepository.create(ruleData);
  },

  /**
   * Update a rule
   */
  async updateRule(id: number, ruleData: any) {
    return ruleRepository.update(id, ruleData);
  },

  /**
   * Delete a rule
   */
  async deleteRule(id: number) {
    return ruleRepository.delete(id);
  },

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

    return ruleRepository.create(defaultRule);
  },
};
