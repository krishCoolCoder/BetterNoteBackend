import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import userService, { CreateUserInput, UpdateUserInput } from './users.service';
import userProfileService from '../userProfiles/userProfile.service';

export class UserController {
  // Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { userName, emailId, password, createdBy } = req.body;

      // Validation
      if (!userName || !emailId || !password) {
        res.status(400).json({
          success: false,
          message: 'Username, email, and password are required'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await userService.checkUserExists(emailId, userName);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email or username already exists'
        });
        return;
      }

      const userData: CreateUserInput = {
        userName,
        emailId,
        password,
        createdBy: createdBy || ''
      };

      const newUser = await userService.createUser(userData);

      // Create user profile with default values
      try {
        await userProfileService.createUserProfile({
          userRefId: newUser._id.toString(),
          allowAnonymousView: false,
          showOnlySharedNotes: true,
          createdBy: newUser.userName
        });
        console.log('✅ User profile created successfully for user:', newUser.userName);
      } catch (profileError: any) {
        console.error('⚠️ Warning: Failed to create user profile:', profileError.message);
        // Continue even if profile creation fails - user is already created
      }

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          _id: newUser._id,
          userName: newUser.userName,
          emailId: newUser.emailId,
          createdBy: newUser.createdBy,
          createdAt: newUser.createdAt,
          updatedBy: newUser.updatedBy,
          updatedAt: newUser.updatedAt
        }
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        count: users.length
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error: any) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userName, emailId, password, updatedBy } = req.body;

      // Check if user exists
      const existingUser = await userService.getUserById(id);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const updateData: UpdateUserInput = {};
      if (userName) updateData.userName = userName;
      if (emailId) updateData.emailId = emailId;
      if (password) updateData.password = password;
      if (updatedBy) updateData.updatedBy = updatedBy;

      const updatedUser = await userService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedUser = await userService.deleteUser(id);

      if (!deletedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: {
          _id: deletedUser._id,
          userName: deletedUser.userName,
          emailId: deletedUser.emailId
        }
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Authenticate user (login)
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { emailId, password } = req.body;

      if (!emailId || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const user = await userService.authenticateUser(emailId, password);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        res.status(500).json({
          success: false,
          message: 'JWT secret not configured'
        });
        return;
      }

      const payload = {
        userId: user._id.toString(),
        emailId: user.emailId,
        userName: user.userName
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: user,
          token: token,
          expiresIn: '24h'
        }
      });
    } catch (error: any) {
      console.error('Error during login:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get user by email
  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const user = await userService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: userResponse
      });
    } catch (error: any) {
      console.error('Error fetching user by email:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get user by username
  async getUserByUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;

      const user = await userService.getUserByUsername(username);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: userResponse
      });
    } catch (error: any) {
      console.error('Error fetching user by username:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new UserController();