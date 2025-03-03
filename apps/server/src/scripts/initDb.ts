import { Pool } from 'pg';
import { config } from '@/config/environment';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const createTables = async () => {
  try {
    // Create rules table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rules (
        id SERIAL PRIMARY KEY,
        priority INTEGER NOT NULL,
        condition JSONB NOT NULL,
        action JSONB NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    console.log('Rules table created or already exists');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    console.log('Users table created or already exists');

    // Create user_rules junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_rules (
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "ruleId" INTEGER REFERENCES rules(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        PRIMARY KEY ("userId", "ruleId")
      )
    `);
    console.log('User_rules table created or already exists');

    console.log('All tables created successfully');
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
