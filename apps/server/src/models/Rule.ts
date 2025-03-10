import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@/config/database';
import { z } from 'zod';

// Define Zod schema for validation
export const RuleSchema = z.object({
  id: z.number().optional(),
  priority: z.number().int().positive(),
  urlFilter: z.string().min(1),
  resourceTypes: z.array(z.string()).min(1),
  requestMethods: z.array(z.string()),
  actionType: z.string().min(1),
  redirectUrl: z.string().nullable().optional(),
  isEnabled: z.boolean(),
  collectionId: z.string().optional(),
});

// Extract TypeScript type from Zod schema
export type RuleInput = z.infer<typeof RuleSchema>;

// Define the attributes interface
interface RuleAttributes {
  id: number;
  priority: number;
  urlFilter: string;
  resourceTypes: string[];
  requestMethods: string[];
  actionType: string;
  redirectUrl?: string | null;
  isEnabled: boolean;
  collectionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  public isEnabled!: boolean;
  public collectionId!: string | null;
  public readonly createdAt!: string;
  public readonly updatedAt!: string;

  constructor(
    id: number,
    priority: number,
    urlFilter: string,
    resourceTypes: string[],
    requestMethods: string[],
    actionType: string,
    redirectUrl: string | null,
    isEnabled: boolean,
    createdAt: string,
    updatedAt: string
  ) {
    super();
    this.id = id;
    this.priority = priority;
    this.urlFilter = urlFilter;
    this.resourceTypes = resourceTypes;
    this.requestMethods = requestMethods;
    this.actionType = actionType;
    this.redirectUrl = redirectUrl;
    this.isEnabled = isEnabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Static method to create a Rule instance from raw data
  static fromRawData(data: {
    id: number;
    priority: number;
    urlFilter: string;
    resourceTypes: string[];
    requestMethods: string[];
    actionType: string;
    redirectUrl?: string | null;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  }): Rule {
    return new Rule(
      data.id,
      data.priority,
      data.urlFilter,
      data.resourceTypes,
      data.requestMethods,
      data.actionType,
      data.redirectUrl,
      data.isEnabled,
      data.createdAt,
      data.updatedAt
    );
  }

  // Static method to create a validated Rule
  static createValidated(input: RuleInput): Rule {
    // Validate input with Zod
    const validatedData = RuleSchema.parse(input);

    // Validate required fields
    if (!validatedData.priority || validatedData.priority < 1) {
      throw new Error('Priority must be a positive integer');
    }

    if (!validatedData.urlFilter) {
      throw new Error('URL filter is required');
    }

    if (
      !validatedData.resourceTypes ||
      !Array.isArray(validatedData.resourceTypes) ||
      validatedData.resourceTypes.length === 0
    ) {
      throw new Error('Resource types must be a non-empty array');
    }

    if (
      !validatedData.requestMethods ||
      !Array.isArray(validatedData.requestMethods) ||
      validatedData.requestMethods.length === 0
    ) {
      throw new Error('Request methods must be a non-empty array');
    }

    if (!validatedData.actionType) {
      throw new Error('Action type is required');
    }

    // Build the Rule instance
    return new Rule(
      validatedData.id || 0, // Sequelize will replace this with auto-increment if it's a new record
      validatedData.priority,
      validatedData.urlFilter,
      validatedData.resourceTypes,
      validatedData.requestMethods,
      validatedData.actionType,
      validatedData.redirectUrl || null,
      validatedData.isEnabled,
      validatedData.createdAt || '',
      validatedData.updatedAt || ''
    );
  }

  // Convert to a plain object (useful for API responses)
  toJSON(): RuleAttributes {
    return {
      id: this.id,
      priority: this.priority,
      urlFilter: this.urlFilter,
      resourceTypes: this.resourceTypes,
      requestMethods: this.requestMethods,
      actionType: this.actionType,
      redirectUrl: this.redirectUrl,
      isEnabled: this.isEnabled,
      collectionId: this.collectionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
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
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    collectionId: {
      type: DataTypes.STRING,
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
