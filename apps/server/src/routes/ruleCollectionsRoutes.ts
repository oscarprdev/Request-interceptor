import { Router } from 'express';
import { rulesCollectionsController } from '@/controllers';

const router = Router();

router.get(
  '/count/:collectionId',
  rulesCollectionsController.countRulesByCollection.bind(rulesCollectionsController)
);

export default router;
