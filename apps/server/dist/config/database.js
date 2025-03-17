"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const environment_1 = require("./environment");
exports.sequelize = new sequelize_1.Sequelize(environment_1.config.databaseUrl, {
    dialect: 'postgres',
    logging: environment_1.config.nodeEnv === 'development' ? console.log : false,
    dialectOptions: {
        ssl: environment_1.config.nodeEnv === 'production'
            ? {
                require: true,
                rejectUnauthorized: false,
            }
            : false,
    },
});
//# sourceMappingURL=database.js.map