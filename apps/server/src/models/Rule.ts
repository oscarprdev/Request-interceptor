import { z } from 'zod';

const ruleSchema = z.object({
  id: z.string({ message: 'Rule ID is required' }).uuid({ message: 'Rule ID is not a valid UUID' }),
  title: z.string({ message: 'Rule title is required' }),
  priority: z
    .number()
    .int({ message: 'Priority must be an integer' })
    .positive({ message: 'Priority must be a positive number' }),
  urlFilter: z.string({ message: 'URL filter is required' }),
  resourceTypes: z
    .array(z.string({ message: 'Resource type must be a string' }))
    .min(1, { message: 'At least one resource type is required' }),
  requestMethods: z
    .array(z.string({ message: 'Request method must be a string' }))
    .min(1, { message: 'At least one request method is required' }),
  actionType: z
    .string({ message: 'Action type is required' })
    .min(1, { message: 'Action type must be at least 1 character long' }),
  redirectUrl: z.string({ message: 'Redirect URL must be a string' }).nullable().optional(),
  isEnabled: z.boolean({ message: 'IsEnabled must be a boolean' }).default(false),
  createdAt: z.date({ message: 'CreatedAt must be a valid date' }).optional(),
  updatedAt: z.date({ message: 'UpdatedAt must be a valid date' }).optional(),
});

class Rule {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly priority: number,
    readonly urlFilter: string,
    readonly resourceTypes: string[],
    readonly requestMethods: string[],
    readonly actionType: string,
    readonly redirectUrl: string | null,
    readonly isEnabled: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate({
      id,
      title,
      priority,
      urlFilter,
      resourceTypes,
      requestMethods,
      actionType,
      redirectUrl,
      isEnabled,
      createdAt,
      updatedAt,
    });
  }

  private validate(input: z.infer<typeof ruleSchema>) {
    const result = ruleSchema.safeParse(input);

    if (!result.success) {
      throw new Error(result.error.errors.map(e => e.message).join('\n'));
    }

    return result.data;
  }
}

export default Rule;
