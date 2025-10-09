import { Request, Response } from 'express';
import userProfileService, { CreateUserProfileInput, UpdateUserProfileInput } from './userProfile.service';

export class UserProfileController {
  // Create a new user profile
  async createUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const {
        userRefId,
        userProfile,
        headerColor,
        sidebarColor,
        appTitle,
        allowAnonymousView,
        showOnlySharedNotes,
        fontStyle,
        allowLinkSharing,
        createdBy
      } = req.body;

      // Validation
      if (!userRefId) {
        res.status(400).json({
          success: false,
          message: 'User reference ID is required'
        });
        return;
      }

      // Check if profile already exists for this user
      const existingProfile = await userProfileService.checkUserProfileExists(userRefId);
      if (existingProfile) {
        res.status(409).json({
          success: false,
          message: 'User profile already exists for this user'
        });
        return;
      }

      const profileData: CreateUserProfileInput = {
        userRefId,
        userProfile,
        headerColor,
        sidebarColor,
        appTitle,
        allowAnonymousView,
        showOnlySharedNotes,
        fontStyle,
        allowLinkSharing,
        createdBy: createdBy || ''
      };

      const newProfile = await userProfileService.createUserProfile(profileData);

      res.status(201).json({
        success: true,
        message: 'User profile created successfully',
        data: newProfile
      });
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get all user profiles
  async getAllUserProfiles(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await userProfileService.getAllUserProfiles();

      res.status(200).json({
        success: true,
        message: 'User profiles retrieved successfully',
        data: profiles,
        count: profiles.length
      });
    } catch (error: any) {
      console.error('Error fetching user profiles:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get user profile by ID
  async getUserProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const profile = await userProfileService.getUserProfileById(id);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: profile
      });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get user profile by user reference ID
  async getUserProfileByUserRefId(req: Request, res: Response): Promise<void> {
    try {
      const { userRefId } = req.params;

      const profile = await userProfileService.getUserProfileByUserRefId(userRefId);

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found for this user'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: profile
      });
    } catch (error: any) {
      console.error('Error fetching user profile by user reference ID:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Update user profile
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        userProfile,
        headerColor,
        sidebarColor,
        appTitle,
        allowAnonymousView,
        showOnlySharedNotes,
        fontStyle,
        allowLinkSharing,
        updatedBy
      } = req.body;

      // Check if profile exists
      const existingProfile = await userProfileService.getUserProfileById(id);
      if (!existingProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
        return;
      }

      const updateData: UpdateUserProfileInput = {};
      if (userProfile !== undefined) updateData.userProfile = userProfile;
      if (headerColor !== undefined) updateData.headerColor = headerColor;
      if (sidebarColor !== undefined) updateData.sidebarColor = sidebarColor;
      if (appTitle !== undefined) updateData.appTitle = appTitle;
      if (allowAnonymousView !== undefined) updateData.allowAnonymousView = allowAnonymousView;
      if (showOnlySharedNotes !== undefined) updateData.showOnlySharedNotes = showOnlySharedNotes;
      if (fontStyle !== undefined) updateData.fontStyle = fontStyle;
      if (allowLinkSharing !== undefined) updateData.allowLinkSharing = allowLinkSharing;
      if (updatedBy !== undefined) updateData.updatedBy = updatedBy;

      const updatedProfile = await userProfileService.updateUserProfile(id, updateData);

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updatedProfile
      });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Update user profile by user reference ID
  async updateUserProfileByUserRefId(req: Request, res: Response): Promise<void> {
    try {
      const { userRefId } = req.params;
      const {
        userProfile,
        headerColor,
        sidebarColor,
        appTitle,
        allowAnonymousView,
        showOnlySharedNotes,
        fontStyle,
        allowLinkSharing,
        updatedBy
      } = req.body;

      // Check if profile exists
      const existingProfile = await userProfileService.getUserProfileByUserRefId(userRefId);
      if (!existingProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found for this user'
        });
        return;
      }

      const updateData: UpdateUserProfileInput = {};
      if (userProfile !== undefined) updateData.userProfile = userProfile;
      if (headerColor !== undefined) updateData.headerColor = headerColor;
      if (sidebarColor !== undefined) updateData.sidebarColor = sidebarColor;
      if (appTitle !== undefined) updateData.appTitle = appTitle;
      if (allowAnonymousView !== undefined) updateData.allowAnonymousView = allowAnonymousView;
      if (showOnlySharedNotes !== undefined) updateData.showOnlySharedNotes = showOnlySharedNotes;
      if (fontStyle !== undefined) updateData.fontStyle = fontStyle;
      if (allowLinkSharing !== undefined) updateData.allowLinkSharing = allowLinkSharing;
      if (updatedBy !== undefined) updateData.updatedBy = updatedBy;

      const updatedProfile = await userProfileService.updateUserProfileByUserRefId(userRefId, updateData);

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updatedProfile
      });
    } catch (error: any) {
      console.error('Error updating user profile by user reference ID:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete user profile
  async deleteUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedProfile = await userProfileService.deleteUserProfile(id);

      if (!deletedProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User profile deleted successfully',
        data: deletedProfile
      });
    } catch (error: any) {
      console.error('Error deleting user profile:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Delete user profile by user reference ID
  async deleteUserProfileByUserRefId(req: Request, res: Response): Promise<void> {
    try {
      const { userRefId } = req.params;

      const deletedProfile = await userProfileService.deleteUserProfileByUserRefId(userRefId);

      if (!deletedProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found for this user'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User profile deleted successfully',
        data: deletedProfile
      });
    } catch (error: any) {
      console.error('Error deleting user profile by user reference ID:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new UserProfileController();

