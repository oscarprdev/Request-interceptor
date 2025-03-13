import { z } from 'zod';

const collectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isEnabled: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
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
