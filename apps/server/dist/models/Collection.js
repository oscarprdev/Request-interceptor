"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const collectionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'Collection ID is required and must be a valid UUID' }),
    name: zod_1.z
        .string({ message: 'Name is required' })
        .min(1, { message: 'Name must be at least 1 character long' }),
    isEnabled: zod_1.z
        .boolean()
        .optional()
        .default(true)
        .refine(val => typeof val === 'boolean', {
        message: 'isEnabled must be a boolean',
    }),
    createdAt: zod_1.z.date({ message: 'CreatedAt must be a valid date' }).optional(),
    updatedAt: zod_1.z.date({ message: 'UpdatedAt must be a valid date' }).optional(),
});
class Collection {
    constructor(id, name, isEnabled, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.isEnabled = isEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate({ id, name, isEnabled, createdAt, updatedAt });
    }
    validate(input) {
        const result = collectionSchema.safeParse(input);
        if (result.error) {
            throw new Error(result.error.errors.join('\n'));
        }
        return result.data;
    }
}
exports.default = Collection;
//# sourceMappingURL=Collection.js.map