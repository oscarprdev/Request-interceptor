import { RuleCollectionsRepository } from '@/repositories/RuleCollectionsRepository';
import { config } from '@/config/environment';
import { Pool } from 'pg';

export class RuleCollectionsService implements RuleCollectionsRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
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
