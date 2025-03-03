import { NextFunction, Request, Response } from 'express';
import { IUserController } from '@/interfaces/controllers/IUserController';
import { IUserService } from '@/interfaces/services/IUserService';
import { userService } from '@/services/userService';

export class UserController implements IUserController {
  constructor(private readonly userService: IUserService) {}

  /**
   * Get all users
   * @route GET /api/v1/users
   */
  async getAllUsers(req: Request, res: Response, next?: NextFunction) {
    const users = await this.userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  }

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  async getUserById(req: Request, res: Response, next?: NextFunction) {
    const id = parseInt(req.params.id);
    const user = await this.userService.getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
  /**
   * Create a new user
   * @route POST /api/v1/users
   */
  async createUser(req: Request, res: Response, next?: NextFunction) {
    const user = await this.userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  }

  /**
   * Update a user
   * @route PUT /api/v1/users/:id
   */
  async updateUser(req: Request, res: Response, next?: NextFunction) {
    const id = parseInt(req.params.id);
    const user = await this.userService.updateUser(id, req.body);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Delete a user
   * @route DELETE /api/v1/users/:id
   */
  async deleteUser(req: Request, res: Response, next?: NextFunction) {
    const id = parseInt(req.params.id);
    const success = await this.userService.deleteUser(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  }

  /**
   * Assign a rule to a user
   * @route POST /api/v1/users/:userId/rules/:ruleId
   */
  async assignRuleToUser(req: Request, res: Response, next?: NextFunction) {
    const userId = parseInt(req.params.userId);
    const ruleId = parseInt(req.params.ruleId);

    const success = await this.userService.assignRuleToUser(userId, ruleId);

    if (!success) {
      res.status(400).json({
        success: false,
        error: 'Failed to assign rule to user',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { userId, ruleId },
    });
  }

  /**
   * Remove a rule from a user
   * @route DELETE /api/v1/users/:userId/rules/:ruleId
   */
  async removeRuleFromUser(req: Request, res: Response, next?: NextFunction) {
    const userId = parseInt(req.params.userId);
    const ruleId = parseInt(req.params.ruleId);

    const success = await this.userService.removeRuleFromUser(userId, ruleId);

    if (!success) {
      res.status(400).json({
        success: false,
        error: 'Failed to remove rule from user',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  }
}

// Export a singleton instance with dependency injection
export const userController = new UserController(userService);
