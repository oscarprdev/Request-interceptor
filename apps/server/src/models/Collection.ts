import { z } from 'zod';

const collectionSchema = z.object({
  id: z.string().uuid({ message: 'Collection ID is required and must be a valid UUID' }),
  name: z
    .string({ message: 'Name is required' })
    .min(1, { message: 'Name must be at least 1 character long' }),
  isEnabled: z
    .boolean()
    .optional()
    .default(true)
    .refine(val => typeof val === 'boolean', {
      message: 'isEnabled must be a boolean',
    }),
  createdAt: z.date({ message: 'CreatedAt must be a valid date' }).optional(),
  updatedAt: z.date({ message: 'UpdatedAt must be a valid date' }).optional(),
});

class Collection {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly isEnabled: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.validate({ id, name, isEnabled, createdAt, updatedAt });
  }

  private validate(input: z.infer<typeof collectionSchema>) {
    const result = collectionSchema.safeParse(input);

    if (result.error) {
      throw new Error(result.error.errors.join('\n'));
    }

    return result.data;
  }
}

export default Collection;
