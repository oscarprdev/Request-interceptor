export interface CollectionInput {
  name: string;
  description?: string;
  isEnabled?: boolean;
}

class Collection {
  id: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string | null,
    isEnabled: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isEnabled = isEnabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createValidated(input: CollectionInput): Collection {
    // Validate required fields
    if (!input.name) {
      throw new Error('Collection name is required');
    }

    // Create a new Collection instance with default values for optional fields
    return new Collection(
      '', // ID will be assigned by the database
      input.name,
      input.description || null,
      input.isEnabled !== undefined ? input.isEnabled : true,
      new Date(),
      new Date()
    );
  }

  static fromRawData(data: {
    id: string;
    name: string;
    description: string | null;
    isEnabled: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
  }): Collection {
    // Convert string dates to Date objects if needed
    const createdAt =
      typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
    const updatedAt =
      typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : data.updatedAt;

    return new Collection(
      data.id,
      data.name,
      data.description,
      data.isEnabled,
      createdAt,
      updatedAt
    );
  }
}

export default Collection;
