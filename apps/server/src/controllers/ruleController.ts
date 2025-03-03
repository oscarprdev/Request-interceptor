import { Request, Response } from 'express';
import { ruleService } from '@/services/ruleService';
import { asyncHandler } from '@/utils/asyncHandler';

export const ruleController = {
  /**
   * Get all rules
   * @route GET /api/v1/rules
   */
  getAllRules: asyncHandler(async (req: Request, res: Response) => {
    const rules = await ruleService.getAllRules();
    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  }),

  /**
   * Get rule by ID
   * @route GET /api/v1/rules/:id
   */
  getRuleById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const rule = await ruleService.getRuleById(id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found',
      });
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
  }),

  /**
   * Create a new rule
   * @route POST /api/v1/rules
   */
  createRule: asyncHandler(async (req: Request, res: Response) => {
    const rule = await ruleService.createRule(req.body);

    res.status(201).json({
      success: true,
      data: rule,
    });
  }),

  /**
   * Update a rule
   * @route PUT /api/v1/rules/:id
   */
  updateRule: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const rule = await ruleService.updateRule(id, req.body);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found',
      });
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
  }),

  /**
   * Delete a rule
   * @route DELETE /api/v1/rules/:id
   */
  deleteRule: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await ruleService.deleteRule(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  }),

  /**
   * Get rules by user ID
   * @route GET /api/v1/rules/user/:userId
   */
  getRulesByUserId: asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const rules = await ruleService.getRulesByUserId(userId);

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  }),

  /**
   * Seed default rule
   * @route POST /api/v1/rules/seed
   */
  seedDefaultRule: asyncHandler(async (req: Request, res: Response) => {
    const rule = await ruleService.seedDefaultRule();

    res.status(201).json({
      success: true,
      data: rule,
    });
  }),
};
