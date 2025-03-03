import { RuleController } from './ruleController';
import { UserController } from './userController';
import { ruleService } from '@/services/ruleService';
import { userService } from '@/services/userService';

// Create controller instances with dependency injection
export const ruleController = new RuleController(ruleService);
export const userController = new UserController(userService); 