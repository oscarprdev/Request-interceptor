import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import User from '../models/User';
import { CollectionRepository } from '../repositories/CollectionRepository';

export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly collectionRepository: CollectionRepository
  ) {}

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  async findById(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const user = await this.userRepository.findById(id);

      if (!user) {
        return res.status(200).json({
          success: true,
          data: null,
        });
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
  async create(req: Request, res: Response, next?: NextFunction) {
    try {
      const { userId } = req.body;

      const newUser = new User(userId);
      const user = await this.userRepository.create(newUser);

      res.status(201).json({
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
  async delete(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const success = await this.userRepository.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
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
   * Get collections for a user
   * @route GET /api/v1/users/:id/collections
   */
  async getUserCollections(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = req.params.id;

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Get collection IDs for this user
      const collectionIds = await this.userRepository.getCollectionsByUserId(userId);

      // If no collections, return empty array
      if (collectionIds.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      // Get full collection objects
      const collectionsPromises = collectionIds.map(id => this.collectionRepository.describe(id));

      const collections = await Promise.all(collectionsPromises);

      // Filter out any null results (in case a collection was deleted)
      const validCollections = collections.filter(collection => collection !== null);

      res.status(200).json({
        success: true,
        data: validCollections,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Assign a collection to a user
   * @route POST /api/v1/users/:userId/collections/:collectionId
   */
  async assignCollectionToUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const { userId, collectionId } = req.params;

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Check if collection exists
      const collection = await this.collectionRepository.describe(collectionId);
      if (!collection) {
        return res.status(404).json({
          success: false,
          error: 'Collection not found',
        });
      }

      // Assign collection to user
      const success = await this.userRepository.assignCollectionToUser(userId, collectionId);

      res.status(200).json({
        success: true,
        data: { assigned: success },
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Remove a collection from a user
   * @route DELETE /api/v1/users/:userId/collections/:collectionId
   */
  async removeCollectionFromUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const { userId, collectionId } = req.params;

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Remove collection from user
      const success = await this.userRepository.removeCollectionFromUser(userId, collectionId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Collection not assigned to user',
        });
      }

      res.status(200).json({
        success: true,
        data: { removed: true },
      });
    } catch (error) {
      next && next(error);
    }
  }
}
