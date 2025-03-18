import { ruleService } from '../services/ruleService';
import { collectionService } from '../services/collectionService';
import { ruleCollectionsService } from '../services/ruleCollectionsService';
import { userService } from '../services/userService';
import { RuleController } from './ruleController';
import { CollectionController } from './collectionController';
import { RuleCollectionsController } from './ruleCollectionsController';
import { UserController } from './userController';

export const ruleController = new RuleController(
  ruleService,
  collectionService,
  ruleCollectionsService
);

export const collectionController = new CollectionController(collectionService, userService);

export const ruleCollectionsController = new RuleCollectionsController(ruleCollectionsService);

export const userController = new UserController(userService, collectionService);
