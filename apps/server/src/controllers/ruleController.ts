import { NextFunction, Request, Response } from 'express';
import { IRuleRepository } from '@/repositories/IRuleRepository';
import { ICollectionRepository } from '@/repositories/ICollectionRepository';

export class RuleController {
  constructor(
    private readonly ruleRepository: IRuleRepository,
    private readonly collectionRepository: ICollectionRepository
  ) {
    console.log('RuleController initialized');
  }

  /**
   * Get all rules with pagination
   * @route GET /api/v1/rules
   */
  async getAllRules(req: Request, res: Response, next?: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const rules = await this.ruleRepository.findAll({ page, limit });

      res.status(200).json({
        success: true,
        ...rules,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Get rule by ID
   * @route GET /api/v1/rules/:id
   */
  async getRuleById(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const rule = await this.ruleRepository.findById(id);

      if (!rule) {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Create a new rule
   * @route POST /api/v1/rules
   */
  async createRule(req: Request, res: Response, next?: NextFunction) {
    try {
      const collectionId = req.params.collectionId;
      const rule = await this.ruleRepository.create(req.body);
      await this.collectionRepository.assignRuleToCollection(collectionId, String(rule.id));

      res.status(201).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Update a rule
   * @route PUT /api/v1/rules/:id
   */
  async updateRule(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const rule = await this.ruleRepository.update(id, req.body);

      if (!rule) {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Delete a rule
   * @route DELETE /api/v1/rules/:id
   */
  async deleteRule(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const success = await this.ruleRepository.delete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Get rules by user ID with pagination
   * @route GET /api/v1/rules/user/:userId
   */
  async getRulesByUserId(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = req.params.userId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const rules = await this.ruleRepository.findByUserId(userId, { page, limit });

      res.status(200).json({
        success: true,
        ...rules,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Get rules by collection ID
   * @route GET /api/v1/rules/collection/:collectionId
   */
  async getRulesByCollectionId(req: Request, res: Response, next?: NextFunction) {
    try {
      const collectionId = req.params.collectionId;
      const rules = await this.ruleRepository.findByCollectionId(collectionId);

      res.status(200).json({
        success: true,
        count: rules.length,
        data: rules,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Seed default rule
   * @route POST /api/v1/rules/seed
   */
  async seedDefaultRule(req: Request, res: Response, next?: NextFunction) {
    try {
      const rule = await this.ruleRepository.seedDefaultRule();

      res.status(201).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      next && next(error);
    }
  }
}
