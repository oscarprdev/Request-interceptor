import { Router } from 'express';
import ruleRoutes from './ruleRoutes';
import collectionRoutes from './collectionRoutes';
import rulesCollections from './ruleCollectionsRoutes';

const router = Router();

const COMMON_ROUTE = '/api/v1';

router.use(`${COMMON_ROUTE}/rules`, ruleRoutes);
router.use(`${COMMON_ROUTE}/collections`, collectionRoutes);
router.use(`${COMMON_ROUTE}/rules-collections`, rulesCollections);

export default router;
