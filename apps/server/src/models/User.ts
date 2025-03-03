import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/config/database';
import Rule from './Rule';
import { z } from 'zod';

// Define Zod schema for validation
export const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

// Extract TypeScript type from Zod schema
export type UserInput = z.infer<typeof UserSchema>;

// Define the attributes interface
interface UserAttributes {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which attributes are optional for creation
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Extend the Model with proper typing
class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public email!: string;
  public name!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to create a User instance from raw data
  static fromRawData(data: { id: number; email: string; name: string; password: string }): User {
    return User.build(data);
  }

  // Static method to create a validated User
  static createValidated(input: unknown): User {
    // Validate input with Zod
    const validatedData = UserSchema.parse(input);

    // Build the User instance
    return User.build({
      ...validatedData,
      id: validatedData.id || 0, // Sequelize will replace this with auto-increment if it's a new record
    });
  }

  // Convert to a plain object (useful for API responses)
  toJSON(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password, // In a real app, you might want to exclude this
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

// Define association with Rule
User.belongsToMany(Rule, {
  through: 'user_rules',
  foreignKey: 'userId',
  otherKey: 'ruleId',
});

Rule.belongsToMany(User, {
  through: 'user_rules',
  foreignKey: 'ruleId',
  otherKey: 'userId',
});

export default User;
