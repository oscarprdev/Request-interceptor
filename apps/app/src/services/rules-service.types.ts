export interface CreateRuleInput {
  urlFilter: string;
  requestMethods: string[];
  response: Record<string, unknown>;
}
