import { NextFunction, Request, Response } from 'express';
import { CollectionRepository } from '../repositories/CollectionRepository';
import Collection from '../models/Collection';
import { UserRepository } from '../repositories/UserRepository';

export class CollectionController {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Get all collections
   * @route GET /api/v1/collections
   */
  async list(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = req.headers.authorization;

      const collections = userId
        ? await this.collectionRepository.list(userId)
        : await this.collectionRepository.list();

      res.status(200).json({
        success: true,
        data: collections,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Get collection by ID
   * @route GET /api/v1/collections/:id
   */
  async describe(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const collection = await this.collectionRepository.describe(id);

      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: collection,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Create a new collection
   * @route POST /api/v1/collections
   */
  async create(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = req.headers.authorization;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User ID is required',
        });
      }

      const { id, name, isEnabled } = req.body;
      const validCollection = new Collection(id, name, isEnabled);
      const collection = await this.collectionRepository.create(validCollection);

      await this.userRepository.assignCollectionToUser(userId, collection.id);

      res.status(201).json({
        success: true,
        data: collection,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Update a collection
   * @route PUT /api/v1/collections/:id
   */
  async update(req: Request, res: Response, next?: NextFunction) {
    try {
      const { id, name, isEnabled } = req.body;
      const validCollection = new Collection(id, name, isEnabled);
      const collection = await this.collectionRepository.update(validCollection);

      if (!collection) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: collection,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Delete a collection
   * @route DELETE /api/v1/collections/:id
   */
  async delete(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const success = await this.collectionRepository.delete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Collection not found',
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
