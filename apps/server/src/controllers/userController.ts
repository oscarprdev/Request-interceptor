import { NextFunction, Request, Response } from 'express';
import { IUserRepository } from '@/repositories/IUserRepository';

export class UserController {
  constructor(private readonly userRepository: IUserRepository) {
    console.log('UserController initialized');
  }

  /**
   * Get all users
   * @route GET /api/v1/users
   */
  async getAllUsers(req: Request, res: Response, next?: NextFunction) {
    try {
      const users = await this.userRepository.findAll();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  async getUserById(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userRepository.findById(id);

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
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Create a new user
   * @route POST /api/v1/users
   */
  async createUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const user = await this.userRepository.create(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Update a user
   * @route PUT /api/v1/users/:id
   */
  async updateUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userRepository.update(id, req.body);

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
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Delete a user
   * @route DELETE /api/v1/users/:id
   */
  async deleteUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const success = await this.userRepository.delete(id);

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
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Assign a rule to a user
   * @route POST /api/v1/users/:userId/rules/:ruleId
   */
  async assignRuleToUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = parseInt(req.params.userId);
      const ruleId = parseInt(req.params.ruleId);

      const success = await this.userRepository.assignRuleToUser(userId, ruleId);

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
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Remove a rule from a user
   * @route DELETE /api/v1/users/:userId/rules/:ruleId
   */
  async removeRuleFromUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = parseInt(req.params.userId);
      const ruleId = parseInt(req.params.ruleId);

      const success = await this.userRepository.removeRuleFromUser(userId, ruleId);

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
    } catch (error) {
      next && next(error);
    }
  }
}
