import { Pool } from 'pg';
import { config } from '@/config/environment';
import createTables from './initDb';
import { ruleService } from '@/services/ruleService';
import { userRepository } from '@/repositories/userRepository';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const seedDatabase = async () => {
  try {
    // Create tables if they don't exist
    await createTables();
    console.log('Database tables created or verified');

    // Create a default user
    const defaultUser = await userRepository.create({
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'password123', // In a real app, this would be hashed
    });
    console.log('Default user created:', defaultUser.toJSON());

    // Seed default rule
    const rule = await ruleService.seedDefaultRule();
    console.log('Default rule created:', rule.toJSON());

    // Assign rule to user
    await userRepository.assignRuleToUser(defaultUser.id, rule.id);
    console.log(`Rule ${rule.id} assigned to user ${defaultUser.id}`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();
