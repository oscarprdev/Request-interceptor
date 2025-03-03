import { Router } from 'express';
import { ruleController } from '@/controllers/ruleController';
import { body } from 'express-validator';
import { validate } from '@/middleware/validator';

const router = Router();

// Validation rules
const ruleValidation = [
  body('priority').isInt({ min: 1 }).withMessage('Priority must be a positive integer'),
  body('condition').isObject().withMessage('Condition must be an object'),
  body('condition.urlFilter').isString().withMessage('URL filter must be a string'),
  body('condition.resourceTypes').isArray().withMessage('Resource types must be an array'),
  body('action').isObject().withMessage('Action must be an object'),
  body('action.type').isString().withMessage('Action type must be a string'),
  validate,
];

// Routes
router.get('/', ruleController.getAllRules);
router.get('/:id', ruleController.getRuleById);
router.get('/user/:userId', ruleController.getRulesByUserId);
router.post('/', ruleValidation, ruleController.createRule);
router.put('/:id', ruleValidation, ruleController.updateRule);
router.delete('/:id', ruleController.deleteRule);
router.post('/seed', ruleController.seedDefaultRule);

export default router;
