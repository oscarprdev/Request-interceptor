import { RuleCollectionsRepository } from '../repositories/RuleCollectionsRepository';
import { config } from '../config/environment';
import { Pool } from 'pg';

export class RuleCollectionsService implements RuleCollectionsRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  async countRulesByCollection(collectionId: string): Promise<number> {
    try {
      const countQuery = `
      SELECT COUNT(*) AS count
      FROM collection_rules
      WHERE "collectionId" = $1
    `;
      const result = await this.pool.query(countQuery, [collectionId]);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error counting rules by collection');
      throw error;
    }
  }

  async assignRuleToCollection(ruleId: string, collectionId: string): Promise<boolean> {
    try {
      const query = `
        INSERT INTO collection_rules ("collectionId", "ruleId", "createdAt", "updatedAt") 
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT ("collectionId", "ruleId") DO NOTHING
      `;
      const values = [collectionId, ruleId];

      const result = await this.pool.query(query, values);
      if (!result || !result.rowCount) {
        await this.pool.query('DELETE FROM rules WHERE "ruleId" = $1', [ruleId]);
      }

      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error in assignRuleToCollection:', error);
      throw error;
    }
  }
}

export const ruleCollectionsService = new RuleCollectionsService();
