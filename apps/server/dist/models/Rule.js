"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ruleSchema = zod_1.z.object({
    id: zod_1.z.string({ message: 'Rule ID is required' }).uuid({ message: 'Rule ID is not a valid UUID' }),
    title: zod_1.z.string({ message: 'Rule title is required' }),
    priority: zod_1.z
        .number()
        .int({ message: 'Priority must be an integer' })
        .positive({ message: 'Priority must be a positive number' }),
    urlFilter: zod_1.z.string({ message: 'URL filter is required' }),
    resourceTypes: zod_1.z
        .array(zod_1.z.string({ message: 'Resource type must be a string' }))
        .min(1, { message: 'At least one resource type is required' }),
    requestMethods: zod_1.z
        .array(zod_1.z.string({ message: 'Request method must be a string' }))
        .min(1, { message: 'At least one request method is required' }),
    actionType: zod_1.z
        .string({ message: 'Action type is required' })
        .min(1, { message: 'Action type must be at least 1 character long' }),
    redirectUrl: zod_1.z.string({ message: 'Redirect URL must be a string' }).nullable().optional(),
    isEnabled: zod_1.z.boolean({ message: 'IsEnabled must be a boolean' }).default(false),
    createdAt: zod_1.z.date({ message: 'CreatedAt must be a valid date' }).optional(),
    updatedAt: zod_1.z.date({ message: 'UpdatedAt must be a valid date' }).optional(),
});
class Rule {
    constructor(id, title, priority, urlFilter, resourceTypes, requestMethods, actionType, redirectUrl, isEnabled, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.urlFilter = urlFilter;
        this.resourceTypes = resourceTypes;
        this.requestMethods = requestMethods;
        this.actionType = actionType;
        this.redirectUrl = redirectUrl;
        this.isEnabled = isEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    validate(input) {
        const result = ruleSchema.safeParse(input);
        if (!result.success) {
            throw new Error(result.error.errors.map(e => e.message).join('\n'));
        }
        return result.data;
    }
}
exports.default = Rule;
//# sourceMappingURL=Rule.js.map