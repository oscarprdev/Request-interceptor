import { Pool } from 'pg';
import { UserRepository } from '../repositories/UserRepository';
import User from '../models/User';
import { config } from '../config/environment';

export class UserService implements UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  async findById(id: string): Promise<User | null> {
    try {
      const query = `
        SELECT * FROM users 
        WHERE id = $1
      `;
      const result = await this.pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapToUser(result.rows[0]);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT * FROM users 
        WHERE email = $1
      `;
      const result = await this.pool.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapToUser(result.rows[0]);
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const query = `
        INSERT INTO users (
          id,
          "createdAt",
          "updatedAt"
        ) 
        VALUES ($1, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [user.id];

      const result = await this.pool.query(query, values);
      return this.mapToUser(result.rows[0]);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return false;
      }

      await this.pool.query('DELETE FROM user_collections WHERE "userId" = $1', [id]);
      await this.pool.query('DELETE FROM user_rules WHERE "userId" = $1', [id]);

      const query = `
        DELETE FROM users 
        WHERE id = $1
      `;

      const result = await this.pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async getCollectionsByUserId(userId: string): Promise<string[]> {
    try {
      const query = `
        SELECT "collectionId" FROM user_collections
        WHERE "userId" = $1
      `;
      const result = await this.pool.query(query, [userId]);
      return result.rows.map(row => row.collectionId);
    } catch (error) {
      console.error('Error in getCollectionsByUserId:', error);
      throw error;
    }
  }

  async assignCollectionToUser(userId: string, collectionId: string): Promise<boolean> {
    try {
      const query = `
        INSERT INTO user_collections ("userId", "collectionId", "createdAt", "updatedAt")
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT ("userId", "collectionId") DO NOTHING
        RETURNING *
      `;

      const result = await this.pool.query(query, [userId, collectionId]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error in assignCollectionToUser:', error);
      throw error;
    }
  }

  async removeCollectionFromUser(userId: string, collectionId: string): Promise<boolean> {
    try {
      const query = `
        DELETE FROM user_collections
        WHERE "userId" = $1 AND "collectionId" = $2
      `;

      const result = await this.pool.query(query, [userId, collectionId]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error in removeCollectionFromUser:', error);
      throw error;
    }
  }

  private mapToUser(row: any): User {
    return new User(row.id, row.createdAt, row.updatedAt);
  }
}

export const userService = new UserService();
