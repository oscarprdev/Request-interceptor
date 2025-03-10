import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/config/database';
import Rule from './Rule';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export type UserInput = z.infer<typeof UserSchema>;

interface UserAttributes {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public email!: string;
  public name!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static fromRawData(data: { id: number; email: string; name: string; password: string }): User {
    return User.build(data);
  }

  static createValidated(input: unknown): User {
    const validatedData = UserSchema.parse(input);

    return User.build({
      ...validatedData,
      id: validatedData.id || 0, // Sequelize will replace this with auto-increment if it's a new record
    });
  }

  toJSON(): UserAttributes {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
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
