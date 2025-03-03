import { NextFunction, Request, Response } from 'express';
import { IRuleRepository } from '@/repositories/IRuleRepository';

export class RuleController {
  constructor(private readonly ruleRepository: IRuleRepository) {
    console.log('RuleController initialized');
  }

  /**
   * Get all rules
   * @route GET /api/v1/rules
   */
  async getAllRules(req: Request, res: Response, next?: NextFunction) {
    try {
      const rules = await this.ruleRepository.findAll();
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
   * Get rule by ID
   * @route GET /api/v1/rules/:id
   */
  async getRuleById(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = parseInt(req.params.id);
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
      const rule = await this.ruleRepository.create(req.body);

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
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
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
   * Get rules by user ID
   * @route GET /api/v1/rules/user/:userId
   */
  async getRulesByUserId(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = parseInt(req.params.userId);
      const rules = await this.ruleRepository.findByUserId(userId);

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
