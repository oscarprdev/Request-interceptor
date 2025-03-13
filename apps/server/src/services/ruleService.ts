import { Pool } from 'pg';
import { IRuleRepository } from '@/repositories/IRuleRepository';
import Rule, { RuleInput } from '@/models/Rule';
import { config } from '@/config/environment';
import { PaginationOptions, PaginatedResult } from '@/repositories/ICollectionRepository';

export class RuleService implements IRuleRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    console.log('RuleService initialized');
  }

  /**
   * Get all rules with pagination
   */
  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Rule>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM rules`;
      const countResult = await this.pool.query(countQuery);
      const total = parseInt(countResult.rows[0].count, 10);

      // Get paginated data
      const query = `
        SELECT * FROM rules 
        ORDER BY "createdAt" DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await this.pool.query(query, [limit, offset]);
      const rules = result.rows.map(row => this.mapToRule(row));

      return {
        data: rules,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * Get rule by ID
   */
  async findById(id: string): Promise<Rule | null> {
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
  async create(ruleData: RuleInput): Promise<Rule> {
    try {
      // Create a validated Rule model instance
      const validatedRule = Rule.createValidated(ruleData);

      const query = `
        INSERT INTO rules (
          priority, 
          "urlFilter", 
          "resourceTypes", 
          "requestMethods", 
          "actionType", 
          "redirectUrl", 
          "isEnabled",
          "createdAt", 
          "updatedAt"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [
        validatedRule.priority,
        validatedRule.urlFilter,
        validatedRule.resourceTypes,
        validatedRule.requestMethods,
        validatedRule.actionType,
        validatedRule.redirectUrl,
        validatedRule.isEnabled,
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
  async update(id: string, ruleData: Partial<RuleInput>): Promise<Rule | null> {
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

      if (ruleData.isEnabled !== undefined) {
        updates.push(`"isEnabled" = $${paramIndex++}`);
        values.push(ruleData.isEnabled);
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
  async delete(id: string): Promise<boolean> {
    try {
      // First check if the rule exists
      const existingRule = await this.findById(id);
      if (!existingRule) {
        return false;
      }

      // Delete from user_rules and collection_rules first to maintain referential integrity
      await this.pool.query('DELETE FROM user_rules WHERE "ruleId" = $1', [id]);
      await this.pool.query('DELETE FROM collection_rules WHERE "ruleId" = $1', [id]);

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
   * Get rules by user ID with pagination
   */
  async findByUserId(userId: string, options?: PaginationOptions): Promise<PaginatedResult<Rule>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const countQuery = `
        SELECT COUNT(*) 
        FROM rules r
        JOIN user_rules ur ON r.id = ur."ruleId"
        WHERE ur."userId" = $1
      `;

      const countResult = await this.pool.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0].count, 10);

      // Get paginated data
      const query = `
        SELECT r.* FROM rules r
        JOIN user_rules ur ON r.id = ur."ruleId"
        WHERE ur."userId" = $1
        ORDER BY r.priority ASC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.pool.query(query, [userId, limit, offset]);
      const rules = result.rows.map(row => this.mapToRule(row));

      return {
        data: rules,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  /**
   * Find rules by collection ID
   */
  async findByCollectionId(collectionId: string): Promise<Rule[]> {
    try {
      const query = `
        SELECT * FROM rules
        WHERE "collectionId" = $1
        ORDER BY priority ASC
      `;

      const result = await this.pool.query(query, [collectionId]);
      return result.rows.map(row => this.mapToRule(row));
    } catch (error) {
      console.error('Error in findByCollectionId:', error);
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
      isEnabled: false,
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
      isEnabled: row.isEnabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

// Export a singleton instance
export const ruleService = new RuleService();
