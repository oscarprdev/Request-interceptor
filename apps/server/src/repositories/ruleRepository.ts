import Rule from '../models/Rule';

export const ruleRepository = {
  /**
   * Get all rules
   */
  async findAll() {
    return Rule.findAll({
      order: [['priority', 'ASC']],
    });
  },

  /**
   * Get rule by ID
   */
  async findById(id: number) {
    return Rule.findByPk(id);
  },

  /**
   * Create a new rule
   */
  async create(ruleData: any) {
    return Rule.create(ruleData);
  },

  /**
   * Update a rule
   */
  async update(id: number, ruleData: any) {
    const rule = await Rule.findByPk(id);
    if (!rule) return null;

    return rule.update(ruleData);
  },

  /**
   * Delete a rule
   */
  async delete(id: number) {
    const rule = await Rule.findByPk(id);
    if (!rule) return false;

    await rule.destroy();
    return true;
  },
};
