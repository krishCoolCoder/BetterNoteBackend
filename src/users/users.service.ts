import User, { IUser } from './user.model';
import mongoose from 'mongoose';

export interface CreateUserInput {
  userName: string;
  emailId: string;
  password: string;
  createdBy?: string;
}

export interface UpdateUserInput {
  userName?: string;
  emailId?: string;
  password?: string;
  updatedBy?: string;
}

export class UserService {
  // Create a new user
  async createUser(userData: CreateUserInput): Promise<IUser> {
    try {
      const user = new User({
        userName: userData.userName,
        emailId: userData.emailId,
        password: userData.password,
        createdBy: userData.createdBy || '',
      });

      const savedUser = await user.save();
      return savedUser;
    } catch (error: any) {
      if (error.code === 11000) {
        // Handle duplicate key error
        const field = Object.keys(error.keyValue)[0];
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  // Get all users
  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find({}, '-password'); // Exclude password field
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findById(userId, '-password');
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(emailId: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ emailId });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user by username
  async getUserByUsername(userName: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ userName });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(userId: string, updateData: UpdateUserInput): Promise<IUser | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      // Update the updatedAt field
      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };

      const user = await User.findByIdAndUpdate(
        userId,
        updatePayload,
        { new: true, runValidators: true }
      ).select('-password');

      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        // Handle duplicate key error
        const field = Object.keys(error.keyValue)[0];
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findByIdAndDelete(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Authenticate user (for login)
  async authenticateUser(emailId: string, password: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ emailId });
      if (!user) {
        return null;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const userObject = user.toObject();
      delete userObject.password;
      return userObject as IUser;
    } catch (error) {
      throw error;
    }
  }

  // Check if user exists by email or username
  async checkUserExists(emailId?: string, userName?: string): Promise<boolean> {
    try {
      const query: any = {};
      if (emailId) query.emailId = emailId;
      if (userName) query.userName = userName;

      if (Object.keys(query).length === 0) {
        return false;
      }

      const user = await User.findOne({ $or: [query] });
      return !!user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();