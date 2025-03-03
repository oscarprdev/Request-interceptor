import { NextFunction, Request, Response } from 'express';
import { IController } from './IController';

export interface IRuleController extends IController {
  getAllRules(req: Request, res: Response, next?: NextFunction): Promise<void>;
  getRuleById(req: Request, res: Response, next?: NextFunction): Promise<void>;
  getRulesByUserId(req: Request, res: Response, next?: NextFunction): Promise<void>;
  createRule(req: Request, res: Response, next?: NextFunction): Promise<void>;
  updateRule(req: Request, res: Response, next?: NextFunction): Promise<void>;
  deleteRule(req: Request, res: Response, next?: NextFunction): Promise<void>;
  seedDefaultRule(req: Request, res: Response, next?: NextFunction): Promise<void>;
}
