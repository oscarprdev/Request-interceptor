import { Model, DataTypes, Optional } from 'sequelize';
import { z } from 'zod';
import { sequelize } from '@/config/database';

export const RuleSchema = z.object({
  priority: z.number().int().positive(),
  urlFilter: z.string().min(1),
  resourceTypes: z.array(z.string()).min(1),
  requestMethods: z.array(z.string()).min(1),
  actionType: z.string().min(1),
  isEnabled: z.boolean().default(false),
  id: z.string().optional(),
  redirectUrl: z.string().nullable().optional(),
  collectionId: z.string().optional(),
});

export type RuleInput = z.infer<typeof RuleSchema>;

interface RuleAttributes {
  id: string;
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

interface RuleCreationAttributes
  extends Optional<RuleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Rule extends Model<RuleAttributes, RuleCreationAttributes> {
  public id!: string;
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

  static fromRawData(data: {
    id: string;
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
    return Rule.build({
      id: data.id,
      priority: data.priority,
      urlFilter: data.urlFilter,
      resourceTypes: data.resourceTypes,
      requestMethods: data.requestMethods,
      actionType: data.actionType,
      redirectUrl: data.redirectUrl || null,
      isEnabled: data.isEnabled,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static createValidated(input: unknown): Rule {
    const validationResult = RuleSchema.safeParse(input);

    if (!validationResult.success) {
      throw new Error(`Validation error: ${validationResult.error.message}`);
    }

    const validatedData = validationResult.data;

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

    return Rule.build({
      id: validatedData.id || undefined,
      priority: validatedData.priority,
      urlFilter: validatedData.urlFilter,
      resourceTypes: validatedData.resourceTypes,
      requestMethods: validatedData.requestMethods,
      actionType: validatedData.actionType,
      redirectUrl: validatedData.redirectUrl || null,
      isEnabled: validatedData.isEnabled,
      collectionId: validatedData.collectionId || null,
    });
  }

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
      type: DataTypes.STRING,
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
      defaultValue: false,
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'collections',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Rule',
    tableName: 'rules',
    timestamps: true,
  }
);

export default Rule;
