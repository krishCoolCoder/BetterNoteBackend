import UserProfile, { IUserProfile } from './userProfile.model';
import mongoose from 'mongoose';

export interface CreateUserProfileInput {
  userRefId: string;
  userProfile?: string;
  headerColor?: string;
  sidebarColor?: string;
  appTitle?: string;
  allowAnonymousView?: boolean;
  showOnlySharedNotes?: boolean;
  fontStyle?: string;
  allowLinkSharing?: string;
  createdBy?: string;
}

export interface UpdateUserProfileInput {
  userProfile?: string;
  headerColor?: string;
  sidebarColor?: string;
  appTitle?: string;
  allowAnonymousView?: boolean;
  showOnlySharedNotes?: boolean;
  fontStyle?: string;
  allowLinkSharing?: string;
  updatedBy?: string;
}

export class UserProfileService {
  // Create a new user profile
  async createUserProfile(profileData: CreateUserProfileInput): Promise<IUserProfile> {
    try {
      const userProfile = new UserProfile({
        userRefId: profileData.userRefId,
        userProfile: profileData.userProfile,
        headerColor: profileData.headerColor,
        sidebarColor: profileData.sidebarColor,
        appTitle: profileData.appTitle,
        allowAnonymousView: profileData.allowAnonymousView !== undefined ? profileData.allowAnonymousView : false,
        showOnlySharedNotes: profileData.showOnlySharedNotes !== undefined ? profileData.showOnlySharedNotes : true,
        fontStyle: profileData.fontStyle,
        allowLinkSharing: profileData.allowLinkSharing,
        createdBy: profileData.createdBy || '',
      });

      const savedProfile = await userProfile.save();
      return savedProfile;
    } catch (error: any) {
      if (error.code === 11000) {
        // Handle duplicate key error
        throw new Error('User profile already exists for this user');
      }
      throw error;
    }
  }

  // Get all user profiles
  async getAllUserProfiles(): Promise<IUserProfile[]> {
    try {
      const profiles = await UserProfile.find({}).populate('userRefId', 'userName emailId');
      return profiles;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile by ID
  async getUserProfileById(profileId: string): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(profileId)) {
        throw new Error('Invalid profile ID format');
      }

      const profile = await UserProfile.findById(profileId).populate('userRefId', 'userName emailId');
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile by user reference ID
  async getUserProfileByUserRefId(userRefId: string): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userRefId)) {
        throw new Error('Invalid user reference ID format');
      }

      const profile = await UserProfile.findOne({ userRefId: new mongoose.Types.ObjectId(userRefId) }).populate('userRefId', 'userName emailId');
      return profile;
    } catch (error) {
      throw error;
    }
  }
  async getUserProfileByUserId(userRefId: string): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userRefId)) {
        throw new Error('Invalid user reference ID format');
      }

      const profile = await UserProfile.findOne({ _id: new mongoose.Types.ObjectId(userRefId) }).populate('userRefId', 'userName emailId');
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(profileId: string, updateData: UpdateUserProfileInput): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(profileId)) {
        throw new Error('Invalid profile ID format');
      }

      // Update the updatedAt field
      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };

      const profile = await UserProfile.findByIdAndUpdate(
        profileId,
        updatePayload,
        { new: true, runValidators: true }
      ).populate('userRefId', 'userName emailId');

      return profile;
    } catch (error: any) {
      throw error;
    }
  }

  // Update user profile by user reference ID
  async updateUserProfileByUserRefId(userRefId: string, updateData: UpdateUserProfileInput): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userRefId)) {
        throw new Error('Invalid user reference ID format');
      }

      // Update the updatedAt field
      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };

      const profile = await UserProfile.findOneAndUpdate(
        { _id : new mongoose.Types.ObjectId(userRefId) },
        updatePayload,
        { new: true, runValidators: true }
      ).populate('userRefId', 'userName emailId');

      return profile;
    } catch (error: any) {
      throw error;
    }
  }

  // Delete user profile
  async deleteUserProfile(profileId: string): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(profileId)) {
        throw new Error('Invalid profile ID format');
      }

      const profile = await UserProfile.findByIdAndDelete(profileId);
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Delete user profile by user reference ID
  async deleteUserProfileByUserRefId(userRefId: string): Promise<IUserProfile | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userRefId)) {
        throw new Error('Invalid user reference ID format');
      }

      const profile = await UserProfile.findOneAndDelete({ userRefId });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Check if user profile exists for a user
  async checkUserProfileExists(userRefId: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userRefId)) {
        return false;
      }

      const profile = await UserProfile.findOne({ userRefId });
      return !!profile;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserProfileService();

