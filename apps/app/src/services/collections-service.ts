import type { Collection, CollectionApplication } from '@/models/Collection';
import { DefaultHttpService } from './http-service';
import type { SafeResult } from './common';
import type { CreateCollectionInput, UpdateCollectionInput } from './collections-service.types';
import { formatPgDate } from '@/utils/dates';
import type { Rule, RuleApplication } from '@/models/Rule';

interface CollectionsService {
  getCollections(): Promise<SafeResult<CollectionApplication[]>>;
  createCollection(input: CreateCollectionInput): Promise<SafeResult<CollectionApplication>>;
  updateCollection(input: UpdateCollectionInput): Promise<SafeResult<CollectionApplication>>;
  deleteCollection(collectionId: string): Promise<SafeResult<void>>;
}

const BASE_URL = 'http://localhost:8080';
const API_URL = '/api/v1/collections';

export class DefaultCollectionsService extends DefaultHttpService implements CollectionsService {
  private apiUrl: string = API_URL;

  constructor() {
    super(BASE_URL);
  }

  async getCollections(): Promise<SafeResult<CollectionApplication[]>> {
    const isAvailable = await this.isServerAvailable();
    if (!isAvailable) {
      return [
        { error: true, message: 'Server is not available. Please check if the server is running.' },
        null,
      ];
    }

    const [error, response] = await this.safeFetch<{ data: Collection[] }>({
      url: this.apiUrl,
    });

    if (error) return [error, null];

    const collections =
      response?.data?.map(collection => this.mapCollectionToApplication(collection)) || [];

    return [null, collections];
  }

  async createCollection(input: CreateCollectionInput): Promise<SafeResult<CollectionApplication>> {
    const body = {
      name: input.name,
      description: input.description,
      isEnabled: false,
    };

    const [error, response] = await this.safeFetch<{ data: Collection }>({
      url: this.apiUrl,
      method: 'POST',
      body,
    });

    if (error) return [error, null];

    const collection = response?.data ? this.mapCollectionToApplication(response.data) : null;

    return [null, collection];
  }

  async updateCollection(input: UpdateCollectionInput): Promise<SafeResult<CollectionApplication>> {
    const payload = {
      name: input.name,
      description: input.description,
      isEnabled: input.isEnabled,
    };

    const [error, response] = await this.safeFetch<{ data: Collection }>({
      url: `${this.apiUrl}/${input.id}`,
      method: 'PUT',
      body: payload,
    });

    if (error) return [error, null];

    const collection = response?.data ? this.mapCollectionToApplication(response.data) : null;

    return [null, collection];
  }

  async deleteCollection(collectionId: string): Promise<SafeResult<void>> {
    const [error] = await this.safeFetch<{ data: void }>({
      url: `${this.apiUrl}/${collectionId}`,
      method: 'DELETE',
    });

    if (error) return [error, null];

    return [null, null];
  }

  async getRulesByCollectionId(collectionId: string): Promise<SafeResult<RuleApplication[]>> {
    const [error, response] = await this.safeFetch<{ data: Rule[] }>({
      url: `${this.apiUrl}/${collectionId}/rules`,
    });

    if (error) return [error, null];

    const rules = response?.data?.map(rule => this.mapRuleToApplication(rule)) || [];

    return [null, rules];
  }

  private mapCollectionToApplication(collection: Collection): CollectionApplication {
    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isEnabled: collection.isEnabled,
      createdAt: formatPgDate(collection.createdAt),
      updatedAt: formatPgDate(collection.updatedAt),
    };
  }

  private mapRuleToApplication(rule: Rule): RuleApplication {
    const response = JSON.parse(atob(rule.redirectUrl?.split(',')[1] || '{}'));

    return {
      id: rule.id,
      priority: rule.priority,
      urlFilter: rule.urlFilter,
      resourceTypes: rule.resourceTypes,
      requestMethods: rule.requestMethods,
      actionType: rule.actionType,
      isEnabled: rule.isEnabled,
      response,
      createdAt: formatPgDate(rule.createdAt),
      updatedAt: formatPgDate(rule.updatedAt),
    };
  }
}

export const collectionsService = new DefaultCollectionsService();
