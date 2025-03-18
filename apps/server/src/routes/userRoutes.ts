import { Router } from 'express';
import { userController } from '../controllers';

const router = Router();

router.get('/:id', userController.findById.bind(userController));
router.post('/', userController.create.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

// Collection management routes
router.get('/:id/collections', userController.getUserCollections.bind(userController));
router.post(
  '/:userId/collections/:collectionId',
  userController.assignCollectionToUser.bind(userController)
);
router.delete(
  '/:userId/collections/:collectionId',
  userController.removeCollectionFromUser.bind(userController)
);

export default router;
