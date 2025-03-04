import type { Rule } from '@/models/Rule';
import { DefaultHttpService } from './http-service';
import type { SafeResult } from './common';
import type { CreateRuleInput } from './rules-service.types';

interface RulesService {
  getRules(): Promise<SafeResult<Rule[]>>;
  getRuleById(id: number): Promise<SafeResult<Rule | null>>;
  createRule(input: CreateRuleInput): Promise<SafeResult<Rule>>;
}

const BASE_URL = 'http://localhost:3001';
const API_URL = '/api/v1/rules';

export class DefaultRulesService extends DefaultHttpService implements RulesService {
  private apiUrl: string = API_URL;

  constructor() {
    super(BASE_URL);
  }

  async getRules(): Promise<SafeResult<Rule[]>> {
    const isAvailable = await this.isServerAvailable();
    if (!isAvailable) {
      return [
        { error: true, message: 'Server is not available. Please check if the server is running.' },
        null,
      ];
    }

    const [error, response] = await this.safeFetch<{ data: Rule[] }>({
      url: this.apiUrl,
    });

    if (error) return [error, null];

    return [null, response?.data || []];
  }

  async getRuleById(id: number): Promise<SafeResult<Rule | null>> {
    const [error, response] = await this.safeFetch<{ data: Rule }>({
      url: `${this.apiUrl}/${id}`,
    });

    if (error) return [error, null];

    return [null, response?.data || null];
  }

  async createRule(input: CreateRuleInput): Promise<SafeResult<Rule>> {
    const body = {
      redirectUrl: 'data:application/json;base64,' + btoa(JSON.stringify(input.response)),
      requestMethods: input.requestMethods,
      urlFilter: input.urlFilter,
      resourceTypes: ['xmlhttprequest'],
      actionType: 'redirect',
      priority: 1,
    };

    const [error, response] = await this.safeFetch<{ data: Rule }>({
      url: this.apiUrl,
      method: 'POST',
      body,
    });

    if (error) return [error, null];

    return [null, response?.data || null];
  }

  async deleteRule(id: number): Promise<SafeResult<boolean>> {
    const [error, response] = await this.safeFetch<{ success: boolean }>({
      url: `${this.apiUrl}/${id}`,
      method: 'DELETE',
    });

    if (error) return [error, null];

    return [null, response?.success || false];
  }
}

export const rulesService = new DefaultRulesService();
