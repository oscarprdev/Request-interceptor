import { Router } from 'express';
import { collectionController } from '@/controllers';
import { body } from 'express-validator';
import { validate } from '@/middleware/validator';

const router = Router();

// Validation rules
const collectionValidation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('isEnabled').optional().isBoolean().withMessage('Is enabled must be a boolean'),
  validate,
];

// Collection CRUD routes
router.get('/', collectionController.getAllCollections.bind(collectionController));
router.get('/:id', collectionController.getCollectionById.bind(collectionController));
router.post(
  '/',
  collectionValidation,
  collectionController.createCollection.bind(collectionController)
);
router.put(
  '/:id',
  collectionValidation,
  collectionController.updateCollection.bind(collectionController)
);
router.delete('/:id', collectionController.deleteCollection.bind(collectionController));

// User-Collection relationship routes
router.get('/user/:userId', collectionController.getCollectionsByUserId.bind(collectionController));
router.post(
  '/:collectionId/users/:userId',
  collectionController.assignCollectionToUser.bind(collectionController)
);
router.delete(
  '/:collectionId/users/:userId',
  collectionController.removeCollectionFromUser.bind(collectionController)
);

// Collection-Rule relationship routes
router.get(
  '/:collectionId/rules',
  collectionController.getRulesByCollectionId.bind(collectionController)
);
router.post(
  '/:collectionId/rules/:ruleId',
  collectionController.assignRuleToCollection.bind(collectionController)
);
router.delete(
  '/:collectionId/rules/:ruleId',
  collectionController.removeRuleFromCollection.bind(collectionController)
);

// Seed route
router.post('/seed', collectionController.seedDefaultCollection.bind(collectionController));

export default router;
