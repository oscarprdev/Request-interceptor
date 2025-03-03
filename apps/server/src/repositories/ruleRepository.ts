import { Pool } from 'pg';
import { IRuleRepository } from '@/interfaces/repositories/IRuleRepository';
import Rule from '@/models/Rule';
import { config } from '@/config/environment';

export class RuleRepository implements IRuleRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  async findAll(): Promise<Rule[]> {
    try {
      const query = `
        SELECT * FROM rules 
        ORDER BY priority ASC
      `;
      const result = await this.pool.query(query);
      return result.rows.map(row => this.mapToRule(row));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Rule | null> {
    try {
      const query = `
        SELECT * FROM rules 
        WHERE id = $1
      `;
      const result = await this.pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async create(ruleData: any): Promise<Rule> {
    try {
      const query = `
        INSERT INTO rules (priority, condition, action, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [
        ruleData.priority,
        JSON.stringify(ruleData.condition),
        JSON.stringify(ruleData.action),
      ];

      const result = await this.pool.query(query, values);
      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(id: number, ruleData: any): Promise<Rule | null> {
    try {
      // First check if the rule exists
      const existingRule = await this.findById(id);
      if (!existingRule) {
        return null;
      }

      const query = `
        UPDATE rules 
        SET 
          priority = $1, 
          condition = $2, 
          action = $3, 
          "updatedAt" = NOW() 
        WHERE id = $4 
        RETURNING *
      `;

      const values = [
        ruleData.priority,
        JSON.stringify(ruleData.condition),
        JSON.stringify(ruleData.action),
        id,
      ];

      const result = await this.pool.query(query, values);
      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // First check if the rule exists
      const existingRule = await this.findById(id);
      if (!existingRule) {
        return false;
      }

      // Delete from user_rules first to maintain referential integrity
      await this.pool.query('DELETE FROM user_rules WHERE "ruleId" = $1', [id]);

      // Then delete the rule
      const query = `
        DELETE FROM rules 
        WHERE id = $1
      `;

      const result = await this.pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<Rule[]> {
    try {
      const query = `
        SELECT r.* FROM rules r
        JOIN user_rules ur ON r.id = ur."ruleId"
        WHERE ur."userId" = $1
        ORDER BY r.priority ASC
      `;

      const result = await this.pool.query(query, [userId]);
      return result.rows.map(row => this.mapToRule(row));
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  private mapToRule(row: any): Rule {
    const rule = Rule.build({
      id: row.id,
      priority: row.priority,
      condition: typeof row.condition === 'string' ? JSON.parse(row.condition) : row.condition,
      action: typeof row.action === 'string' ? JSON.parse(row.action) : row.action,
    });

    rule.setDataValue('createdAt', row.createdAt);
    rule.setDataValue('updatedAt', row.updatedAt);

    return rule;
  }
}

// Export a singleton instance
export const ruleRepository = new RuleRepository();
