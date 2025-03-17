import { z } from 'zod';

const userSchema = z.object({
  id: z.string({ message: 'User ID is required' }).uuid({ message: 'User ID is not a valid UUID' }),
  createdAt: z.date({ message: 'CreatedAt must be a valid date' }).optional(),
  updatedAt: z.date({ message: 'UpdatedAt must be a valid date' }).optional(),
});

export default class User {
  constructor(
    public readonly id: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validate({
      id,
      createdAt,
      updatedAt,
    });
  }

  private validate(input: z.infer<typeof userSchema>) {
    const result = userSchema.safeParse(input);

    if (!result.success) {
      throw new Error(result.error.errors.map(e => e.message).join('\n'));
    }

    return result.data;
  }
}
