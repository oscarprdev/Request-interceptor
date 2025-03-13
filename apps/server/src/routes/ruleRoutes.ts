import { Router } from 'express';
import { ruleController } from '@/controllers';

const router = Router();

router.get('/', ruleController.list.bind(ruleController));
router.post('/', ruleController.create.bind(ruleController));
router.put('/', ruleController.update.bind(ruleController));

router.get('/:id', ruleController.describe.bind(ruleController));
router.delete('/:id', ruleController.delete.bind(ruleController));

router.get('/collection/:collectionId', ruleController.listByCollectionId.bind(ruleController));

export default router;
