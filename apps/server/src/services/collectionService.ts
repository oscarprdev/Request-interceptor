import { Pool } from 'pg';
import {
  ICollectionRepository,
  PaginationOptions,
  PaginatedResult,
} from '@/repositories/ICollectionRepository';
import Collection, { CollectionInput } from '@/models/Collection';
import Rule from '@/models/Rule';
import { config } from '@/config/environment';

export class CollectionService implements ICollectionRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    console.log('CollectionService initialized');
  }

  /**
   * Get all collections
   */
  async findAll(): Promise<Collection[]> {
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
  async findById(id: string): Promise<Collection | null> {
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
  async create(collectionData: CollectionInput): Promise<Collection> {
    try {
      // Create a validated Collection model instance
      const validatedCollection = Collection.createValidated(collectionData);

      const query = `
        INSERT INTO collections (
          name, 
          description, 
          "isEnabled",
          "createdAt", 
          "updatedAt"
        ) 
        VALUES ($1, $2, $3, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [
        validatedCollection.name,
        validatedCollection.description,
        validatedCollection.isEnabled,
      ];

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
  async update(id: string, collectionData: Partial<CollectionInput>): Promise<Collection | null> {
    try {
      // First check if the collection exists
      const existingCollection = await this.findById(id);
      if (!existingCollection) {
        return null;
      }

      // Build the SET part of the query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (collectionData.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(collectionData.name);
      }

      if (collectionData.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(collectionData.description);
      }

      if (collectionData.isEnabled !== undefined) {
        updates.push(`"isEnabled" = $${paramIndex++}`);
        values.push(collectionData.isEnabled);
      }

      updates.push(`"updatedAt" = NOW()`);

      // Add the id as the last parameter
      values.push(id);

      const query = `
        UPDATE collections 
        SET ${updates.join(', ')} 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;

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
      // First check if the collection exists
      const existingCollection = await this.findById(id);
      if (!existingCollection) {
        return false;
      }

      // Delete the collection (related records will be cascade deleted due to foreign key constraints)
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

  /**
   * Get collections by user ID with pagination
   */
  async findByUserId(
    userId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Collection>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const countQuery = `
        SELECT COUNT(*) 
        FROM collections c
        JOIN user_collections uc ON c.id = uc."collectionId"
        WHERE uc."userId" = $1
      `;

      const countResult = await this.pool.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0].count, 10);

      // Get paginated data
      const query = `
        SELECT c.* 
        FROM collections c
        JOIN user_collections uc ON c.id = uc."collectionId"
        WHERE uc."userId" = $1
        ORDER BY c."createdAt" DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.pool.query(query, [userId, limit, offset]);
      const collections = result.rows.map(row => this.mapToCollection(row));

      return {
        data: collections,
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
   * Assign a collection to a user
   */
  async assignCollectionToUser(userId: string, collectionId: string): Promise<boolean> {
    try {
      // Check if the collection exists
      const collection = await this.findById(collectionId);
      if (!collection) {
        return false;
      }

      // Check if the user exists
      const userExists = await this.pool.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userExists.rows.length === 0) {
        return false;
      }

      // Check if the assignment already exists
      const existingAssignment = await this.pool.query(
        'SELECT * FROM user_collections WHERE "userId" = $1 AND "collectionId" = $2',
        [userId, collectionId]
      );

      if (existingAssignment.rows.length > 0) {
        // Assignment already exists
        return true;
      }

      // Create the assignment
      const query = `
        INSERT INTO user_collections ("userId", "collectionId", "createdAt", "updatedAt") 
        VALUES ($1, $2, NOW(), NOW())
      `;

      await this.pool.query(query, [userId, collectionId]);
      return true;
    } catch (error) {
      console.error('Error in assignCollectionToUser:', error);
      throw error;
    }
  }

  /**
   * Remove a collection from a user
   */
  async removeCollectionFromUser(userId: string, collectionId: string): Promise<boolean> {
    try {
      // Check if the assignment exists
      const existingAssignment = await this.pool.query(
        'SELECT * FROM user_collections WHERE "userId" = $1 AND "collectionId" = $2',
        [userId, collectionId]
      );

      if (existingAssignment.rows.length === 0) {
        // Assignment doesn't exist
        return false;
      }

      // Remove the assignment
      const query = `
        DELETE FROM user_collections 
        WHERE "userId" = $1 AND "collectionId" = $2
      `;

      await this.pool.query(query, [userId, collectionId]);
      return true;
    } catch (error) {
      console.error('Error in removeCollectionFromUser:', error);
      throw error;
    }
  }

  /**
   * Get rules by collection ID with pagination
   */
  async findRulesByCollectionId(
    collectionId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Rule>> {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const offset = (page - 1) * limit;

      // Get total count
      const countQuery = `
        SELECT COUNT(*) 
        FROM rules r
        JOIN collection_rules cr ON r.id = cr."ruleId"
        WHERE cr."collectionId" = $1
      `;

      const countResult = await this.pool.query(countQuery, [collectionId]);
      const total = parseInt(countResult.rows[0].count, 10);

      // Get paginated data
      const query = `
        SELECT r.* 
        FROM rules r
        JOIN collection_rules cr ON r.id = cr."ruleId"
        WHERE cr."collectionId" = $1
        ORDER BY r.priority ASC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.pool.query(query, [collectionId, limit, offset]);
      const rules = result.rows.map(row => this.mapToRule(row));

      console.log({ rules: rules[0].dataValues });

      return {
        data: rules,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in findRulesByCollectionId:', error);
      throw error;
    }
  }

  /**
   * Assign a rule to a collection
   */
  async assignRuleToCollection(collectionId: string, ruleId: string): Promise<boolean> {
    try {
      // Check if the collection exists
      const collection = await this.findById(collectionId);
      if (!collection) {
        return false;
      }

      // Check if the rule exists
      const ruleExists = await this.pool.query('SELECT id FROM rules WHERE id = $1', [ruleId]);
      if (ruleExists.rows.length === 0) {
        return false;
      }

      // Check if the assignment already exists
      const existingAssignment = await this.pool.query(
        'SELECT * FROM collection_rules WHERE "collectionId" = $1 AND "ruleId" = $2',
        [collectionId, ruleId]
      );

      if (existingAssignment.rows.length > 0) {
        // Assignment already exists
        return true;
      }

      // Create the assignment
      const query = `
        INSERT INTO collection_rules ("collectionId", "ruleId", "createdAt", "updatedAt") 
        VALUES ($1, $2, NOW(), NOW())
      `;

      await this.pool.query(query, [collectionId, ruleId]);
      return true;
    } catch (error) {
      console.error('Error in assignRuleToCollection:', error);
      throw error;
    }
  }

  /**
   * Remove a rule from a collection
   */
  async removeRuleFromCollection(collectionId: string, ruleId: string): Promise<boolean> {
    try {
      // Check if the assignment exists
      const existingAssignment = await this.pool.query(
        'SELECT * FROM collection_rules WHERE "collectionId" = $1 AND "ruleId" = $2',
        [collectionId, ruleId]
      );

      if (existingAssignment.rows.length === 0) {
        // Assignment doesn't exist
        return false;
      }

      // Remove the assignment
      const query = `
        DELETE FROM collection_rules 
        WHERE "collectionId" = $1 AND "ruleId" = $2
      `;

      await this.pool.query(query, [collectionId, ruleId]);
      return true;
    } catch (error) {
      console.error('Error in removeRuleFromCollection:', error);
      throw error;
    }
  }

  /**
   * Seed default collection
   */
  async seedDefaultCollection(): Promise<Collection> {
    const defaultCollection = {
      name: 'Default Collection',
      description: 'Default collection created automatically',
      isEnabled: true,
    };

    return this.create(defaultCollection);
  }

  private mapToCollection(row: any): Collection {
    return Collection.fromRawData({
      id: row.id,
      name: row.name,
      description: row.description,
      isEnabled: row.isEnabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
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
export const collectionService = new CollectionService();
