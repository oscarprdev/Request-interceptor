import { NextFunction, Request, Response } from 'express';
import { IRuleController } from '@/interfaces/controllers/IRuleController';
import { IRuleService } from '@/interfaces/services/IRuleService';
import { ruleService } from '@/services/ruleService';

export class RuleController implements IRuleController {
  constructor(private readonly ruleService: IRuleService) {}

  /**
   * Get all rules
   * @route GET /api/v1/rules
   */
  async getAllRules(req: Request, res: Response, next?: NextFunction) {
    const rules = await this.ruleService.getAllRules();
    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  }
  /**
   * Get rule by ID
   * @route GET /api/v1/rules/:id
   */
  async getRuleById(req: Request, res: Response, next?: NextFunction) {
    const id = parseInt(req.params.id);
    const rule = await this.ruleService.getRuleById(id);

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
  }

  /**
   * Create a new rule
   * @route POST /api/v1/rules
   */
  async createRule(req: Request, res: Response, next?: NextFunction) {
    const rule = await this.ruleService.createRule(req.body);

    res.status(201).json({
      success: true,
      data: rule,
    });
  }

  /**
   * Update a rule
   * @route PUT /api/v1/rules/:id
   */
  async updateRule(req: Request, res: Response, next?: NextFunction) {
    const id = parseInt(req.params.id);
    const rule = await this.ruleService.updateRule(id, req.body);

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
  }

  /**
   * Delete a rule
   * @route DELETE /api/v1/rules/:id
   */
  async deleteRule(req: Request, res: Response, next?: NextFunction) {
    const id = parseInt(req.params.id);
    const success = await this.ruleService.deleteRule(id);

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
  }

  /**
   * Get rules by user ID
   * @route GET /api/v1/rules/user/:userId
   */
  async getRulesByUserId(req: Request, res: Response, next?: NextFunction) {
    const userId = parseInt(req.params.userId);
    const rules = await this.ruleService.getRulesByUserId(userId);

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  }

  /**
   * Seed default rule
   * @route POST /api/v1/rules/seed
   */
  async seedDefaultRule(req: Request, res: Response, next?: NextFunction) {
    const rule = await this.ruleService.seedDefaultRule();

    res.status(201).json({
      success: true,
      data: rule,
    });
  }
}

// Export a singleton instance with dependency injection
export const ruleController = new RuleController(ruleService);
