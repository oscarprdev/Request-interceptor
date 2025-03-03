import { sequelize } from '../config/database';
import { ruleService } from '../services/ruleService';
import Rule from '../models/Rule';

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models
    await sequelize.sync({ force: true });
    console.log('Database tables created.');
    
    // Seed default rule
    const rule = await ruleService.seedDefaultRule();
    console.log('Default rule created:', rule.toJSON());
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 