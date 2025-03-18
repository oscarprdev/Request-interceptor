import { Router } from 'express';
import { ruleCollectionsController } from '../controllers';
const router = Router();

router.get(
  '/count/:collectionId',
  ruleCollectionsController.countRulesByCollection.bind(ruleCollectionsController)
);

export default router;
