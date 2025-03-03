import { Router } from 'express';
import { userController } from '@/controllers/userController';
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
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userValidation, userController.createUser);
router.put('/:id', userValidation, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:userId/rules/:ruleId', userController.assignRuleToUser);
router.delete('/:userId/rules/:ruleId', userController.removeRuleFromUser);

export default router; 