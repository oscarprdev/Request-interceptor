import { Router } from 'express';
import ruleRoutes from './ruleRoutes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// API routes
router.use('/rules', ruleRoutes);

export default router; 