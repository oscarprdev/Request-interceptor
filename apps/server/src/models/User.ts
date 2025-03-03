import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/config/database';
import Rule from './Rule';

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
