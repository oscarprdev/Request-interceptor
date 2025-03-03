require('module-alias/register');

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import createTables from './scripts/initDb';

// Initialize express app
const app = express();
const port = config.port;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(corsMiddleware); // CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Initialize database tables
    await createTables();
    console.log('Database tables initialized successfully.');

    // Start listening
    app.listen(port, () => {
      console.log(`Server running on port ${port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
