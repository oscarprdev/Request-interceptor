import { Router } from 'express';
import { collectionController } from '@/controllers';

const router = Router();

router.get('/', collectionController.list.bind(collectionController));
router.post('/', collectionController.create.bind(collectionController));
router.put('/', collectionController.update.bind(collectionController));

router.get('/:id', collectionController.describe.bind(collectionController));
router.delete('/:id', collectionController.delete.bind(collectionController));

export default router;
