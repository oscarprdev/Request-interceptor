import { Router } from 'express';
import { ruleController } from '@/controllers';
import { body } from 'express-validator';
import { validate } from '@/middleware/validator';

const router = Router();

// Validation rules
const ruleValidation = [
  body('priority').isInt({ min: 1 }).withMessage('Priority must be a positive integer'),
  body('urlFilter').isString().withMessage('URL filter must be a string'),
  body('resourceTypes').isArray().withMessage('Resource types must be an array'),
  body('requestMethods').isArray().withMessage('Request methods must be an array'),
  body('actionType').isString().withMessage('Action type must be a string'),
  body('isEnabled').isBoolean().withMessage('Is enabled must be a boolean'),
  body('redirectUrl').optional().isString().withMessage('Redirect URL must be a string'),
  validate,
];

// Routes
router.get('/', ruleController.getAllRules.bind(ruleController));
router.post('/seed', ruleController.seedDefaultRule.bind(ruleController));
router.get('/user/:userId', ruleController.getRulesByUserId.bind(ruleController));
router.get('/:id', ruleController.getRuleById.bind(ruleController));
router.post('/', ruleValidation, ruleController.createRule.bind(ruleController));
router.put('/:id', ruleValidation, ruleController.updateRule.bind(ruleController));
router.delete('/:id', ruleController.deleteRule.bind(ruleController));

export default router;
