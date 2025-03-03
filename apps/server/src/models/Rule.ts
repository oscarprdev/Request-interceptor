import { Model, DataTypes, Optional, ModelStatic } from 'sequelize';
import { sequelize } from '@/config/database';

// Define the attributes interface
interface RuleAttributes {
  id: number;
  priority: number;
  urlFilter: string;
  resourceTypes: string[];
  requestMethods: string[];
  actionType: string;
  redirectUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which attributes are optional for creation
interface RuleCreationAttributes
  extends Optional<RuleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Extend the Model with proper typing
class Rule extends Model<RuleAttributes, RuleCreationAttributes> {
  public id!: number;
  public priority!: number;
  public urlFilter!: string;
  public resourceTypes!: string[];
  public requestMethods!: string[];
  public actionType!: string;
  public redirectUrl!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to create a Rule instance from raw data
  static fromRawData(data: {
    id: number;
    priority: number;
    urlFilter: string;
    resourceTypes: string[];
    requestMethods: string[];
    actionType: string;
    redirectUrl?: string | null;
  }): Rule {
    return Rule.build(data);
  }
}

Rule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    urlFilter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resourceTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    requestMethods: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    redirectUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'rules',
    timestamps: true,
  }
);

export default Rule;
