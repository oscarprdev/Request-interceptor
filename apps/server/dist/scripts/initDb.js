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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const environment_1 = require("@/config/environment");
const pool = new pg_1.Pool({
    connectionString: environment_1.config.databaseUrl,
});
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        "isEnabled" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS user_collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
        "collectionId" UUID REFERENCES collections(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("userId", "collectionId")
      )
    `);
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        priority INTEGER NOT NULL,
        title TEXT NOT NULL,
        "urlFilter" VARCHAR(255) NOT NULL,
        "resourceTypes" TEXT[] NOT NULL,
        "requestMethods" TEXT[] NOT NULL,
        "actionType" VARCHAR(50) NOT NULL,
        "redirectUrl" TEXT,
        "isEnabled" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS collection_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "collectionId" UUID REFERENCES collections(id) ON DELETE CASCADE,
        "ruleId" UUID REFERENCES rules(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("collectionId", "ruleId")
      )
    `);
        yield pool.query(`
      CREATE TABLE IF NOT EXISTS user_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
        "ruleId" UUID REFERENCES rules(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("userId", "ruleId")
      )
    `);
        console.log('Tables created successfully');
        return true;
    }
    catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
    finally {
        yield pool.end();
    }
});
exports.default = createTables;
// If this script is run directly
if (require.main === module) {
    createTables()
        .then(() => {
        console.log('Database initialization completed');
        process.exit(0);
    })
        .catch(error => {
        console.error('Database initialization failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=initDb.js.map