import { Request, Response } from 'express';
import userProfileService, { CreateUserProfileInput, UpdateUserProfileInput } from './userProfile.service';
const { uploadToS3, validateImageFile, deleteFromS3, getPresignedUrl } = require('../../utils/s3Upload');

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

      // const profile = await userProfileService.getUserProfileById(id);
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

  // Upload profile image to S3 and update userProfile
  async uploadProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const { userRefId } = req.body;

      // Validation
      if (!userRefId) {
        res.status(400).json({
          success: false,
          message: 'User reference ID is required'
        });
        return;
      }

      // Check if file was uploaded
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded. Please upload an image file'
        });
        return;
      }

      // Validate image file
      try {
        validateImageFile(req.file);
      } catch (validationError: any) {
        res.status(400).json({
          success: false,
          message: validationError.message
        });
        return;
      }

      // Check if user profile exists
      const existingProfile = await userProfileService.getUserProfileByUserId(userRefId);
      if (!existingProfile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found for this user'
        });
        return;
      }

      // Delete old profile image from S3 if it exists
      if (existingProfile.userProfile && existingProfile.userProfile.startsWith('http')) {
        try {
          await deleteFromS3(existingProfile.userProfile);
          console.log('🗑️  Old profile image deleted');
        } catch (deleteError) {
          console.error('⚠️  Warning: Failed to delete old profile image:', deleteError);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new image to S3
      const imageUrl = await uploadToS3(req.file, 'userProfiles');

      // Update user profile with new image URL
      const updatedProfile = await userProfileService.updateUserProfileByUserRefId(
        userRefId,
        {
          userProfile: imageUrl,
          updatedBy: req.body.updatedBy || 'system'
        }
      );

      res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          imageUrl: imageUrl,
          profile: updatedProfile
        }
      });

    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get presigned URL for profile image
  async getProfileImageUrl(req: Request, res: Response): Promise<void> {
    try {
      const { userRefId } = req.params;
      const { expiresIn } = req.query; // Optional: expiration time in seconds

      // Validation
      if (!userRefId) {
        res.status(400).json({
          success: false,
          message: 'User reference ID is required'
        });
        return;
      }

      // Get user profile
      const profile = await userProfileService.getUserProfileByUserRefId(userRefId);
      
      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
        return;
      }

      // Check if profile has an image
      if (!profile.userProfile || !profile.userProfile.startsWith('http')) {
        res.status(404).json({
          success: false,
          message: 'No profile image found for this user'
        });
        return;
      }

      // Generate presigned URL
      const expirationTime = expiresIn ? parseInt(expiresIn as string) : 3600; // Default 1 hour
      const presignedUrl = await getPresignedUrl(profile.userProfile, expirationTime);

      res.status(200).json({
        success: true,
        message: 'Presigned URL generated successfully',
        data: {
          presignedUrl: presignedUrl,
          expiresIn: expirationTime,
          expiresAt: new Date(Date.now() + expirationTime * 1000).toISOString()
        }
      });

    } catch (error: any) {
      console.error('Error generating presigned URL:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Get presigned URL for profile image by profile ID
  async getProfileImageUrlById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { expiresIn } = req.query; // Optional: expiration time in seconds

      // Validation
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Profile ID is required'
        });
        return;
      }

      // Get user profile by profile ID
      const profile = await userProfileService.getUserProfileById(id);
      
      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
        return;
      }

      // Check if profile has an image
      if (!profile.userProfile || !profile.userProfile.startsWith('http')) {
        res.status(404).json({
          success: false,
          message: 'No profile image found for this profile'
        });
        return;
      }

      // Generate presigned URL
      const expirationTime = expiresIn ? parseInt(expiresIn as string) : 3600; // Default 1 hour
      const presignedUrl = await getPresignedUrl(profile.userProfile, expirationTime);

      res.status(200).json({
        success: true,
        message: 'Presigned URL generated successfully',
        data: {
          presignedUrl: presignedUrl,
          expiresIn: expirationTime,
          expiresAt: new Date(Date.now() + expirationTime * 1000).toISOString(),
          profileId: profile._id
        }
      });

    } catch (error: any) {
      console.error('Error generating presigned URL by profile ID:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

export default new UserProfileController();

