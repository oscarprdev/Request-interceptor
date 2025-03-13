import { RuleController } from './ruleController';
import { CollectionController } from './collectionController';
import { ruleService } from '@/services/ruleService';
import { collectionService } from '@/services/collectionService';

export const ruleController = new RuleController(ruleService, collectionService);
export const collectionController = new CollectionController(collectionService);
