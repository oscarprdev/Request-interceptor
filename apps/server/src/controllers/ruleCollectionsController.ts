import { RuleCollectionsRepository } from '@/repositories/RuleCollectionsRepository';
import { NextFunction, Request, Response } from 'express';

export class RuleCollectionsController {
  constructor(private readonly ruleCollections: RuleCollectionsRepository) {}

  async countRulesByCollection(req: Request, res: Response, next?: NextFunction) {
    try {
      const collectionId = req.params.collectionId;
      const rulesCount = await this.ruleCollections.countRulesByCollection(collectionId);

      res.status(200).json({
        success: true,
        data: rulesCount,
      });
    } catch (error) {
      next && next(error);
    }
  }
}
