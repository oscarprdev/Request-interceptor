import { Pool } from 'pg';
import { IUserRepository } from '@/repositories/IUserRepository';
import User from '@/models/User';
import { config } from '@/config/environment';

export class UserService implements IUserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    console.log('UserService initialized');
  }

  async findAll(): Promise<User[]> {
    try {
      const query = `
        SELECT * FROM users 
        ORDER BY id ASC
      `;
      const result = await this.pool.query(query);
      return result.rows.map(row => this.mapToUser(row));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
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

  async create(userData: any): Promise<User> {
    try {
      const query = `
        INSERT INTO users (email, name, password, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, NOW(), NOW()) 
        RETURNING *
      `;

      const values = [
        userData.email,
        userData.name,
        userData.password, // In a real app, this would be hashed
      ];

      const result = await this.pool.query(query, values);
      return this.mapToUser(result.rows[0]);
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(id: number, userData: any): Promise<User | null> {
    try {
      // First check if the user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return null;
      }

      const query = `
        UPDATE users 
        SET 
          email = $1, 
          name = $2, 
          password = $3, 
          "updatedAt" = NOW() 
        WHERE id = $4 
        RETURNING *
      `;

      const values = [
        userData.email,
        userData.name,
        userData.password, // In a real app, this would be hashed
        id,
      ];

      const result = await this.pool.query(query, values);
      return this.mapToUser(result.rows[0]);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // First check if the user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return false;
      }

      // Delete from user_rules first to maintain referential integrity
      await this.pool.query('DELETE FROM user_rules WHERE "userId" = $1', [id]);

      // Then delete the user
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

  async assignRuleToUser(userId: number, ruleId: number): Promise<boolean> {
    try {
      // Check if the user and rule exist
      const user = await this.findById(userId);
      if (!user) {
        return false;
      }

      // Check if the rule exists (we need to query the rules table)
      const ruleExists = await this.pool.query('SELECT id FROM rules WHERE id = $1', [ruleId]);
      if (ruleExists.rows.length === 0) {
        return false;
      }

      // Check if the assignment already exists
      const existingAssignment = await this.pool.query(
        'SELECT * FROM user_rules WHERE "userId" = $1 AND "ruleId" = $2',
        [userId, ruleId]
      );

      if (existingAssignment.rows.length > 0) {
        // Assignment already exists
        return true;
      }

      // Create the assignment
      const query = `
        INSERT INTO user_rules ("userId", "ruleId", "createdAt", "updatedAt") 
        VALUES ($1, $2, NOW(), NOW())
      `;

      await this.pool.query(query, [userId, ruleId]);
      return true;
    } catch (error) {
      console.error('Error in assignRuleToUser:', error);
      throw error;
    }
  }

  async removeRuleFromUser(userId: number, ruleId: number): Promise<boolean> {
    try {
      // Check if the assignment exists
      const existingAssignment = await this.pool.query(
        'SELECT * FROM user_rules WHERE "userId" = $1 AND "ruleId" = $2',
        [userId, ruleId]
      );

      if (existingAssignment.rows.length === 0) {
        // Assignment doesn't exist
        return false;
      }

      // Remove the assignment
      const query = `
        DELETE FROM user_rules 
        WHERE "userId" = $1 AND "ruleId" = $2
      `;

      await this.pool.query(query, [userId, ruleId]);
      return true;
    } catch (error) {
      console.error('Error in removeRuleFromUser:', error);
      throw error;
    }
  }

  private mapToUser(row: any): User {
    return User.fromRawData({
      id: row.id,
      email: row.email,
      name: row.name,
      password: row.password,
    });
  }
}

// Export a singleton instance
export const userService = new UserService();
