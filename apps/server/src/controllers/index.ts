import { RuleController } from './ruleController';
import { CollectionController } from './collectionController';
import { UserController } from './userController';
import { ruleService } from '@/services/ruleService';
import { collectionService } from '@/services/collectionService';
import { userService } from '@/services/userService';

// Initialize controllers with their respective services
export const ruleController = new RuleController(ruleService, collectionService);
export const collectionController = new CollectionController(collectionService);
export const userController = new UserController(userService);
