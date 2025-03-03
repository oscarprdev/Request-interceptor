import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/config/database';
import Rule from './Rule';

interface UserAttributes {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public password!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
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
  as: 'rules',
});

Rule.belongsToMany(User, {
  through: 'user_rules',
  foreignKey: 'ruleId',
  otherKey: 'userId',
  as: 'users',
});

export default User;
