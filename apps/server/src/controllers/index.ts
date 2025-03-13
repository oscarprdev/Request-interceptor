import { RuleController } from './ruleController';
import { CollectionController } from './collectionController';
import { ruleService } from '@/services/ruleService';
import { collectionService } from '@/services/collectionService';

// Initialize controllers with their respective services
export const ruleController = new RuleController(ruleService);
export const collectionController = new CollectionController(collectionService);
