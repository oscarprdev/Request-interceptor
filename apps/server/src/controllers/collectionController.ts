import { NextFunction, Request, Response } from 'express';
import { ICollectionRepository } from '@/repositories/ICollectionRepository';

export class CollectionController {
  constructor(private readonly collectionRepository: ICollectionRepository) {
    console.log('CollectionController initialized');
  }

  /**
   * Get all collections
   * @route GET /api/v1/collections
   */
  async getAllCollections(req: Request, res: Response, next?: NextFunction) {
    try {
      const collections = await this.collectionRepository.findAll();
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
  async getCollectionById(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const collection = await this.collectionRepository.findById(id);

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
  async createCollection(req: Request, res: Response, next?: NextFunction) {
    try {
      const collection = await this.collectionRepository.create(req.body);

      // If userId is provided, assign the collection to the user
      if (req.body.userId) {
        await this.collectionRepository.assignCollectionToUser(req.body.userId, collection.id);
      }

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
  async updateCollection(req: Request, res: Response, next?: NextFunction) {
    try {
      const id = req.params.id;
      const collection = await this.collectionRepository.update(id, req.body);

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
  async deleteCollection(req: Request, res: Response, next?: NextFunction) {
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

  /**
   * Get collections by user ID with pagination
   * @route GET /api/v1/collections/user/:userId
   */
  async getCollectionsByUserId(req: Request, res: Response, next?: NextFunction) {
    try {
      const userId = req.params.userId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const collections = await this.collectionRepository.findByUserId(userId, { page, limit });

      res.status(200).json({
        success: true,
        ...collections,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Assign a collection to a user
   * @route POST /api/v1/collections/:collectionId/users/:userId
   */
  async assignCollectionToUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const { collectionId, userId } = req.params;
      const success = await this.collectionRepository.assignCollectionToUser(userId, collectionId);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Collection or user not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Collection assigned to user successfully',
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Remove a collection from a user
   * @route DELETE /api/v1/collections/:collectionId/users/:userId
   */
  async removeCollectionFromUser(req: Request, res: Response, next?: NextFunction) {
    try {
      const { collectionId, userId } = req.params;
      const success = await this.collectionRepository.removeCollectionFromUser(
        userId,
        collectionId
      );

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Collection or user not found or not assigned',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Collection removed from user successfully',
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Get rules by collection ID with pagination
   * @route GET /api/v1/collections/:collectionId/rules
   */
  async getRulesByCollectionId(req: Request, res: Response, next?: NextFunction) {
    try {
      const collectionId = req.params.collectionId;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const rules = await this.collectionRepository.findRulesByCollectionId(collectionId, {
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        ...rules,
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Assign a rule to a collection
   * @route POST /api/v1/collections/:collectionId/rules/:ruleId
   */
  async assignRuleToCollection(req: Request, res: Response, next?: NextFunction) {
    try {
      const { collectionId, ruleId } = req.params;
      const success = await this.collectionRepository.assignRuleToCollection(collectionId, ruleId);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Collection or rule not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Rule assigned to collection successfully',
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Remove a rule from a collection
   * @route DELETE /api/v1/collections/:collectionId/rules/:ruleId
   */
  async removeRuleFromCollection(req: Request, res: Response, next?: NextFunction) {
    try {
      const { collectionId, ruleId } = req.params;
      const success = await this.collectionRepository.removeRuleFromCollection(
        collectionId,
        ruleId
      );

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Collection or rule not found or not assigned',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Rule removed from collection successfully',
      });
    } catch (error) {
      next && next(error);
    }
  }

  /**
   * Seed default collection
   * @route POST /api/v1/collections/seed
   */
  async seedDefaultCollection(req: Request, res: Response, next?: NextFunction) {
    try {
      const collection = await this.collectionRepository.seedDefaultCollection();

      // If userId is provided, assign the collection to the user
      if (req.body.userId) {
        await this.collectionRepository.assignCollectionToUser(req.body.userId, collection.id);
      }

      res.status(201).json({
        success: true,
        data: collection,
      });
    } catch (error) {
      next && next(error);
    }
  }
}
