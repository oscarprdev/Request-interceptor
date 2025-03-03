import { Pool } from 'pg';
import { config } from '@/config/environment';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      )
    `);

    // Create rules table with separate columns instead of JSON
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rules (
        id SERIAL PRIMARY KEY,
        priority INTEGER NOT NULL,
        "urlFilter" VARCHAR(255) NOT NULL,
        "resourceTypes" TEXT[] NOT NULL,
        "requestMethods" TEXT[] NOT NULL,
        "actionType" VARCHAR(50) NOT NULL,
        "redirectUrl" TEXT,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL
      )
    `);

    // Create user_rules junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_rules (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "ruleId" INTEGER REFERENCES rules(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
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
