import { IUserRepository } from '@/interfaces/repositories/IUserRepository';
import { IUserService } from '@/interfaces/services/IUserService';
import User from '@/models/User';
import { userRepository } from '@/repositories/userRepository';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(userData: any): Promise<User> {
    // In a real app, you would hash the password here
    return this.userRepository.create(userData);
  }

  async updateUser(id: number, userData: any): Promise<User | null> {
    // In a real app, you would hash the password here if it's being updated
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async assignRuleToUser(userId: number, ruleId: number): Promise<boolean> {
    return this.userRepository.assignRuleToUser(userId, ruleId);
  }

  async removeRuleFromUser(userId: number, ruleId: number): Promise<boolean> {
    return this.userRepository.removeRuleFromUser(userId, ruleId);
  }
}

// Export a singleton instance with dependency injection
export const userService = new UserService(userRepository);
