import { Pool } from 'pg';
import Collection from '@/models/Collection';
import { config } from '@/config/environment';
import { CollectionRepository } from '@/repositories/CollectionRepository';

export class CollectionService implements CollectionRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  /**
   * Get all collections
   */
  async list(): Promise<Collection[]> {
    try {
      const query = `
        SELECT * FROM collections 
        ORDER BY "createdAt" DESC
      `;
      const result = await this.pool.query(query);
      return result.rows.map(row => this.mapToCollection(row));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * Get collection by ID
   */
  async describe(id: string): Promise<Collection | null> {
    try {
      const query = `
        SELECT * FROM collections 
        WHERE id = $1
      `;
      const result = await this.pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapToCollection(result.rows[0]);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  /**
   * Create a new collection
   */
  async create(collection: Collection): Promise<Collection> {
    try {
      const query = `
        INSERT INTO collections (
          name, 
          "isEnabled",
          "createdAt", 
          "updatedAt"
        ) 
        VALUES ($1, $2, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [collection.name, collection.isEnabled];

      const result = await this.pool.query(query, values);
      return this.mapToCollection(result.rows[0]);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  /**
   * Update a collection
   */
  async update(collection: Collection): Promise<Collection | null> {
    try {
      const existingCollection = await this.describe(collection.id);
      if (!existingCollection) {
        return null;
      }

      const query = `
        UPDATE collections 
        SET name = $1, "isEnabled" = $2, "updatedAt" = NOW()
        WHERE id = $3 
        RETURNING *
      `;

      const values = [collection.name, collection.isEnabled, collection.id];

      const result = await this.pool.query(query, values);
      return this.mapToCollection(result.rows[0]);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Delete a collection
   */
  async delete(id: string): Promise<boolean> {
    try {
      const existingCollection = await this.describe(id);
      if (!existingCollection) {
        return false;
      }

      const query = `
        DELETE FROM collections 
        WHERE id = $1
      `;

      const result = await this.pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private mapToCollection(row: any): Collection {
    return new Collection(row.id, row.name, row.isEnabled, row.createdAt, row.updatedAt);
  }
}

export const collectionService = new CollectionService();
