import type { Rule, RuleApplication } from '@/models/Rule';
import { DefaultHttpService } from './http-service';
import type { SafeResult } from './common';
import type { CreateRuleInput, UpdateRuleInput } from './rules-service.types';
import { formatPgDate } from '@/utils/dates';

interface RulesService {
  getRules(): Promise<SafeResult<RuleApplication[]>>;
  createRule(input: CreateRuleInput): Promise<SafeResult<RuleApplication>>;
  updateRule(input: UpdateRuleInput): Promise<SafeResult<RuleApplication>>;
}

const BASE_URL = 'http://localhost:8080';
const API_URL = '/api/v1/rules';

export class DefaultRulesService extends DefaultHttpService implements RulesService {
  private apiUrl: string = API_URL;

  constructor() {
    super(BASE_URL);
  }

  async getRules(): Promise<SafeResult<RuleApplication[]>> {
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

    const rules = response?.data?.map(rule => this.mapRuleToApplication(rule)) || [];
    console.log('rules', rules);
    return [null, rules];
  }

  async createRule(input: CreateRuleInput): Promise<SafeResult<RuleApplication>> {
    const body = {
      redirectUrl: 'data:application/json;base64,' + btoa(JSON.stringify(input.response)),
      requestMethods: input.requestMethods,
      urlFilter: input.urlFilter,
      resourceTypes: ['xmlhttprequest'],
      actionType: 'redirect',
      priority: 1,
      isEnabled: false,
    };

    const [error, response] = await this.safeFetch<{ data: Rule }>({
      url: this.apiUrl,
      method: 'POST',
      body,
    });

    if (error) return [error, null];

    const rule = response?.data ? this.mapRuleToApplication(response.data) : null;

    return [null, rule];
  }

  async updateRule(input: UpdateRuleInput): Promise<SafeResult<RuleApplication>> {
    const [error, response] = await this.safeFetch<{ data: Rule }>({
      url: `${this.apiUrl}/${input.rule.id}`,
      method: 'PUT',
      body: input.rule,
    });

    if (error) return [error, null];

    const rule = response?.data ? this.mapRuleToApplication(response.data) : null;

    return [null, rule];
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

export const rulesService = new DefaultRulesService();
