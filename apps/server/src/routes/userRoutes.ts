import { Router } from 'express';
import { userController } from '@/controllers';
import { body } from 'express-validator';
import { validate } from '@/middleware/validator';

const router = Router();

// Validation rules
const userValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

// Routes
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', userValidation, userController.createUser.bind(userController));
router.put('/:id', userValidation, userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post('/:userId/rules/:ruleId', userController.assignRuleToUser.bind(userController));
router.delete('/:userId/rules/:ruleId', userController.removeRuleFromUser.bind(userController));

export default router; 