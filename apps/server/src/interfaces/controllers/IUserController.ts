import { NextFunction, Request, Response } from 'express';
import { IController } from './IController';

export interface IUserController extends IController {
  getAllUsers(req: Request, res: Response, next?: NextFunction): Promise<void>;
  getUserById(req: Request, res: Response, next?: NextFunction): Promise<void>;
  createUser(req: Request, res: Response, next?: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next?: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next?: NextFunction): Promise<void>;
  assignRuleToUser(req: Request, res: Response, next?: NextFunction): Promise<void>;
  removeRuleFromUser(req: Request, res: Response, next?: NextFunction): Promise<void>;
}
