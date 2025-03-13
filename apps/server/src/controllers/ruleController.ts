import { NextFunction, Request, Response } from 'express';
import { RuleRepository } from '@/repositories/IRuleRepository';
import Rule from '@/models/Rule';

export class RuleController {
  constructor(private readonly ruleRepository: RuleRepository) {}

  /**
   * Get all rules with pagination
   * @route GET /api/v1/rules
   */
  async list(req: Request, res: Response, next?: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const rules = await this.ruleRepository.list({ page, limit });

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
  async describe(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const rule = await this.ruleRepository.describe(id);

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
  async create(req: Request, res: Response, next?: NextFunction) {
    try {
      const { id, urlFilter, requestMethods, redirectUrl, isEnabled } = req.body;
      const defaultPriority = 1;
      const defaultResourcesTypes = ['xmlhttprequest'];
      const defaultActionType = 'block';

      const newRule = new Rule(
        id,
        defaultPriority,
        urlFilter,
        defaultResourcesTypes,
        requestMethods,
        defaultActionType,
        redirectUrl,
        isEnabled
      );

      const rule = await this.ruleRepository.create(newRule);

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
  async update(req: Request, res: Response, next?: NextFunction) {
    try {
      const { id, urlFilter, requestMethods, redirectUrl, isEnabled } = req.body;
      const currentRule = await this.ruleRepository.describe(id);
      if (!currentRule) {
        res.status(404).json({
          success: false,
          error: 'Rule not found',
        });
        return;
      }

      const ruleUpdated = new Rule(
        id,
        currentRule.priority,
        urlFilter,
        currentRule.resourceTypes,
        requestMethods,
        currentRule.actionType,
        redirectUrl,
        isEnabled
      );

      const rule = await this.ruleRepository.update(ruleUpdated);

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
  async delete(req: Request, res: Response, next?: NextFunction) {
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
   * Get rules by collection ID
   * @route GET /api/v1/rules/collection/:collectionId
   */
  async listByCollectionId(req: Request, res: Response, next?: NextFunction) {
    try {
      const collectionId = req.params.collectionId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const rules = await this.ruleRepository.listByCollectionId(collectionId, { page, limit });

      res.status(200).json({
        success: true,
        ...rules,
      });
    } catch (error) {
      next && next(error);
    }
  }
}
