"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const environment_1 = require("@/config/environment");
const initDb_1 = __importDefault(require("./initDb"));
const ruleService_1 = require("@/services/ruleService");
const userService_1 = require("@/services/userService");
const pool = new pg_1.Pool({
    connectionString: environment_1.config.databaseUrl,
});
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create tables if they don't exist
        yield (0, initDb_1.default)();
        console.log('Database tables created or verified');
        // Create a default user
        const defaultUser = yield userService_1.userService.createUser({
            email: 'admin@example.com',
            name: 'Admin User',
            password: 'password123', // In a real app, this would be hashed
        });
        console.log('Default user created:', defaultUser.toJSON());
        // Seed default rule
        const rule = yield ruleService_1.ruleService.seedDefaultRule();
        console.log('Default rule created:', rule.toJSON());
        // Assign rule to user
        yield userService_1.userService.assignRuleToUser(defaultUser.id, rule.id);
        console.log(`Rule ${rule.id} assigned to user ${defaultUser.id}`);
        console.log('Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
    finally {
        yield pool.end();
    }
});
seedDatabase();
//# sourceMappingURL=seed.js.map