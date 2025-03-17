"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    id: zod_1.z.string({ message: 'User ID is required' }).uuid({ message: 'User ID is not a valid UUID' }),
    createdAt: zod_1.z.date({ message: 'CreatedAt must be a valid date' }).optional(),
    updatedAt: zod_1.z.date({ message: 'UpdatedAt must be a valid date' }).optional(),
});
class User {
    constructor(id, createdAt, updatedAt) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validate({
            id,
            createdAt,
            updatedAt,
        });
    }
    validate(input) {
        const result = userSchema.safeParse(input);
        if (!result.success) {
            throw new Error(result.error.errors.map(e => e.message).join('\n'));
        }
        return result.data;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map