import { Pool } from 'pg';
import { IRuleRepository } from '@/repositories/IRuleRepository';
import Rule from '@/models/Rule';
import { config } from '@/config/environment';

export class RuleService implements IRuleRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    console.log('RuleService initialized');
  }

  /**
   * Get all rules
   */
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

  /**
   * Get rule by ID
   */
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

  /**
   * Create a new rule
   */
  async create(ruleData: {
    priority: number;
    urlFilter: string;
    resourceTypes: string[];
    requestMethods: string[];
    actionType: string;
    redirectUrl?: string;
  }): Promise<Rule> {
    try {
      const query = `
        INSERT INTO rules (
          priority, 
          "urlFilter", 
          "resourceTypes", 
          "requestMethods", 
          "actionType", 
          "redirectUrl", 
          "createdAt", 
          "updatedAt"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [
        ruleData.priority,
        ruleData.urlFilter,
        ruleData.resourceTypes,
        ruleData.requestMethods,
        ruleData.actionType,
        ruleData.redirectUrl || null,
      ];

      const result = await this.pool.query(query, values);
      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  /**
   * Update a rule
   */
  async update(
    id: number,
    ruleData: {
      priority?: number;
      urlFilter?: string;
      resourceTypes?: string[];
      requestMethods?: string[];
      actionType?: string;
      redirectUrl?: string;
    }
  ): Promise<Rule | null> {
    try {
      // First check if the rule exists
      const existingRule = await this.findById(id);
      if (!existingRule) {
        return null;
      }

      // Build the SET part of the query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (ruleData.priority !== undefined) {
        updates.push(`priority = $${paramIndex++}`);
        values.push(ruleData.priority);
      }

      if (ruleData.urlFilter !== undefined) {
        updates.push(`"urlFilter" = $${paramIndex++}`);
        values.push(ruleData.urlFilter);
      }

      if (ruleData.resourceTypes !== undefined) {
        updates.push(`"resourceTypes" = $${paramIndex++}`);
        values.push(ruleData.resourceTypes);
      }

      if (ruleData.requestMethods !== undefined) {
        updates.push(`"requestMethods" = $${paramIndex++}`);
        values.push(ruleData.requestMethods);
      }

      if (ruleData.actionType !== undefined) {
        updates.push(`"actionType" = $${paramIndex++}`);
        values.push(ruleData.actionType);
      }

      if (ruleData.redirectUrl !== undefined) {
        updates.push(`"redirectUrl" = $${paramIndex++}`);
        values.push(ruleData.redirectUrl);
      }

      updates.push(`"updatedAt" = NOW()`);

      // Add the id as the last parameter
      values.push(id);

      const query = `
        UPDATE rules 
        SET ${updates.join(', ')} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;

      const result = await this.pool.query(query, values);
      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Delete a rule
   */
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

  /**
   * Get rules by user ID
   */
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

  /**
   * Seed default rule
   */
  async seedDefaultRule(): Promise<Rule> {
    const defaultRule = {
      priority: 1,
      urlFilter: 'localhost:3000/example',
      resourceTypes: ['xmlhttprequest'],
      requestMethods: ['get', 'post', 'delete'],
      actionType: 'redirect',
      redirectUrl:
        'data:application/json;base64,' +
        Buffer.from(
          JSON.stringify({
            message: 'This is a mocked response for both GET and POST requests from the extension',
          })
        ).toString('base64'),
    };

    return this.create(defaultRule);
  }

  private mapToRule(row: any): Rule {
    return Rule.fromRawData({
      id: row.id,
      priority: row.priority,
      urlFilter: row.urlFilter,
      resourceTypes: row.resourceTypes,
      requestMethods: row.requestMethods,
      actionType: row.actionType,
      redirectUrl: row.redirectUrl,
    });
  }
}

// Export a singleton instance
export const ruleService = new RuleService();
