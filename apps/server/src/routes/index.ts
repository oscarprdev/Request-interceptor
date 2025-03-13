import { Router } from 'express';
import ruleRoutes from './ruleRoutes';
import collectionRoutes from './collectionRoutes';

const router = Router();

const COMMON_ROUTE = '/api/v1';

router.use(`${COMMON_ROUTE}/rules`, ruleRoutes);
router.use(`${COMMON_ROUTE}/collections`, collectionRoutes);

export default router;
