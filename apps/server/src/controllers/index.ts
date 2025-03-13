import { RuleController } from './ruleController';
import { CollectionController } from './collectionController';
import { ruleService } from '@/services/ruleService';
import { collectionService } from '@/services/collectionService';
import { ruleCollectionsService } from '@/services/ruleCollectionsService';

export const ruleController = new RuleController(
  ruleService,
  collectionService,
  ruleCollectionsService
);
export const collectionController = new CollectionController(collectionService);
