import { Pool } from 'pg';
import { config } from '@/config/environment';
import createTables from './initDb';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const seedDatabase = async () => {
  try {
    // Create tables if they don't exist
    await createTables();
    console.log('Database tables created or verified');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();
