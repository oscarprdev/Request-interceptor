import { z } from 'zod';

interface AddRuleFormEmits {
  (e: 'success'): void;
  (e: 'error', error: string): void;
  (e: 'submitting', isSubmitting: boolean): void;
}

const ruleSchema = z.object({
  urlFilter: z.string().min(1, 'URL filter is required'),
  requestMethods: z.array(z.string()).min(1, 'At least one request method is required'),
  response: z.string().min(2, 'Response is required and must be valid JSON'),
});

type RuleFormData = z.infer<typeof ruleSchema>;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const satisfies Record<string, RequestMethod>;

export {
  type AddRuleFormEmits,
  type RuleFormData,
  type RequestMethod,
  ruleSchema,
  REQUEST_METHODS,
};
