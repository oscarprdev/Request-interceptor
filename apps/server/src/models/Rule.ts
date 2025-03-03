import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/config/database';

interface RuleAttributes {
  id: number;
  priority: number;
  condition: {
    urlFilter: string;
    resourceTypes: string[];
    requestMethods?: string[];
    domains?: string[];
    excludedDomains?: string[];
  };
  action: {
    type: string;
    redirect?: {
      url?: string;
      transform?: {
        scheme?: string;
        host?: string;
        path?: string;
        queryTransform?: {
          removeParams?: string[];
          addOrReplaceParams?: { key: string; value: string }[];
        };
      };
    };
    requestHeaders?: Array<{
      header: string;
      operation: string;
      value?: string;
    }>;
    responseHeaders?: Array<{
      header: string;
      operation: string;
      value?: string;
    }>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface RuleCreationAttributes extends Optional<RuleAttributes, 'id'> {}

class Rule extends Model<RuleAttributes, RuleCreationAttributes> implements RuleAttributes {
  public id!: number;
  public priority!: number;
  public condition!: {
    urlFilter: string;
    resourceTypes: string[];
    requestMethods?: string[];
    domains?: string[];
    excludedDomains?: string[];
  };
  public action!: {
    type: string;
    redirect?: {
      url?: string;
      transform?: {
        scheme?: string;
        host?: string;
        path?: string;
        queryTransform?: {
          removeParams?: string[];
          addOrReplaceParams?: { key: string; value: string }[];
        };
      };
    };
    requestHeaders?: Array<{
      header: string;
      operation: string;
      value?: string;
    }>;
    responseHeaders?: Array<{
      header: string;
      operation: string;
      value?: string;
    }>;
  };

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    condition: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    action: {
      type: DataTypes.JSONB,
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
