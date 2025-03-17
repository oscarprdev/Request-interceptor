import { Router } from 'express';
import ruleRoutes from './ruleRoutes';
import collectionRoutes from './collectionRoutes';
import ruleCollectionsRoutes from './ruleCollectionsRoutes';
import userRoutes from './userRoutes';

const router = Router();

const COMMON_ROUTE = '/api/v1';

router.use(`${COMMON_ROUTE}/rules`, ruleRoutes);
router.use(`${COMMON_ROUTE}/collections`, collectionRoutes);
router.use(`${COMMON_ROUTE}/rules-collections`, ruleCollectionsRoutes);
router.use(`${COMMON_ROUTE}/users`, userRoutes);

export default router;
