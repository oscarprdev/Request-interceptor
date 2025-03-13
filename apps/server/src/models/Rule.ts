import { z } from 'zod';

const ruleSchema = z.object({
  id: z.string().uuid(),
  priority: z.number().int().positive(),
  urlFilter: z.string().min(1),
  resourceTypes: z.array(z.string()).min(1),
  requestMethods: z.array(z.string()).min(1),
  actionType: z.string().min(1),
  redirectUrl: z.string().nullable().optional(),
  isEnabled: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

class Rule {
  constructor(
    readonly id: string,
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
