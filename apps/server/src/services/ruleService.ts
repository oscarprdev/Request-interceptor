import { Pool } from 'pg';
import { RuleRepository, PaginationOptions, PaginatedResult } from '@/repositories/RuleRepository';
import Rule from '@/models/Rule';
import { config } from '@/config/environment';

export class RuleService implements RuleRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  async list(options?: PaginationOptions): Promise<PaginatedResult<Rule>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const countQuery = `SELECT COUNT(*) FROM rules`;
      const countResult = await this.pool.query(countQuery);
      const total = parseInt(countResult.rows[0].count, 10);

      const query = `
        SELECT * FROM rules 
        ORDER BY "priority" DESC
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
      console.error('Error in list:', error);
      throw error;
    }
  }

  async describe(id: string): Promise<Rule | null> {
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
      console.error('Error in describe:', error);
      throw error;
    }
  }

  async create(rule: Rule): Promise<Rule> {
    try {
      const query = `
        INSERT INTO rules (
          id,
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [
        rule.id,
        rule.priority,
        rule.urlFilter,
        rule.resourceTypes,
        rule.requestMethods,
        rule.actionType,
        rule.redirectUrl,
        rule.isEnabled,
      ];

      const result = await this.pool.query(query, values);
      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(rule: Rule): Promise<Rule | null> {
    try {
      const existingRule = await this.describe(rule.id);
      if (!existingRule) {
        return null;
      }

      const query = `
        UPDATE rules 
        SET priority = $1, 
        "urlFilter" = $2, 
        "resourceTypes" = $3, 
        "requestMethods" = $4, 
        "actionType" = $5,
        "redirectUrl" = $6, 
        "isEnabled" = $7,
        "updatedAt" = NOW()
        WHERE id = $8 
        RETURNING *
      `;

      const {
        id,
        priority,
        urlFilter,
        resourceTypes,
        requestMethods,
        actionType,
        redirectUrl,
        isEnabled,
      } = rule;

      const result = await this.pool.query(query, [
        priority,
        urlFilter,
        resourceTypes,
        requestMethods,
        actionType,
        redirectUrl,
        isEnabled,
        id,
      ]);
      return this.mapToRule(result.rows[0]);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existingRule = await this.describe(id);
      if (!existingRule) {
        return false;
      }

      // await this.pool.query('DELETE FROM user_rules WHERE "ruleId" = $1', [id]);
      await this.pool.query('DELETE FROM collection_rules WHERE "ruleId" = $1', [id]);

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

  async listByCollectionId(
    collectionId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Rule>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      const countQuery = `
        SELECT COUNT(*) 
        FROM rules r
        JOIN collection_rules cr ON r.id = cr."ruleId"
        WHERE cr."collectionId" = $1
      `;

      const countResult = await this.pool.query(countQuery, [collectionId]);
      const total = parseInt(countResult.rows[0].count, 10);

      const query = `
        SELECT r.* FROM rules r
        JOIN collection_rules cr ON r.id = cr."ruleId"
        WHERE cr."collectionId" = $1
        ORDER BY r.priority ASC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.pool.query(query, [collectionId, limit, offset]);
      const rules = result.rows.map(row => this.mapToRule(row));

      return {
        data: rules,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in listByCollectionId:', error);
      throw error;
    }
  }

  private mapToRule(row: any): Rule {
    return new Rule(
      row.id,
      row.priority,
      row.urlFilter,
      row.resourceTypes,
      row.requestMethods,
      row.actionType,
      row.redirectUrl,
      row.isEnabled,
      row.createdAt,
      row.updatedAt
    );
  }
}

export const ruleService = new RuleService();
