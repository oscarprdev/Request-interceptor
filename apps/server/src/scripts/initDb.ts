import { Pool } from 'pg';
import { config } from '@/config/environment';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const createTables = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        "isEnabled" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
        "collectionId" UUID REFERENCES collections(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("userId", "collectionId")
      )
    `);

    await pool.query(`
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS collection_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "collectionId" UUID REFERENCES collections(id) ON DELETE CASCADE,
        "ruleId" UUID REFERENCES rules(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("collectionId", "ruleId")
      )
    `);

    await pool.query(`
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
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

export default createTables;

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
