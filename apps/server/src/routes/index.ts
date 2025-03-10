import { Router } from 'express';
import ruleRoutes from './ruleRoutes';
import userRoutes from './userRoutes';
import collectionRoutes from './collectionRoutes';

const router = Router();

const COMMON_ROUTE = '/api/v1';

// Health check route
router.get(`${COMMON_ROUTE}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// API routes
router.use(`${COMMON_ROUTE}/rules`, ruleRoutes);
router.use(`${COMMON_ROUTE}/users`, userRoutes);
router.use(`${COMMON_ROUTE}/collections`, collectionRoutes);

export default router;
