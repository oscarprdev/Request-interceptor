import User from '@/models/User';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: any): Promise<User>;
  updateUser(id: number, userData: any): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  assignRuleToUser(userId: number, ruleId: number): Promise<boolean>;
  removeRuleFromUser(userId: number, ruleId: number): Promise<boolean>;
}
