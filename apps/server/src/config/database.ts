import { Sequelize } from 'sequelize';
import { config } from './environment';

export const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? console.log : false,
  dialectOptions: {
    ssl:
      config.nodeEnv === 'production'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});
