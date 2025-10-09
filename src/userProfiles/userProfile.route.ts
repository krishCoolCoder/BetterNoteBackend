import { Router } from 'express';
import userProfileController from './userProfile.controller';

const router = Router();

// Create a new user profile
router.post('/', userProfileController.createUserProfile.bind(userProfileController));

// Get all user profiles
router.get('/', userProfileController.getAllUserProfiles.bind(userProfileController));

// Get user profile by user reference ID (must be before /:id)
router.get('/user/:userRefId', userProfileController.getUserProfileByUserRefId.bind(userProfileController));

// Get user profile by ID
router.get('/:id', userProfileController.getUserProfileById.bind(userProfileController));

// Update user profile by user reference ID (must be before /:id)
router.put('/user/:userRefId', userProfileController.updateUserProfileByUserRefId.bind(userProfileController));

// Update user profile by ID
router.put('/:id', userProfileController.updateUserProfile.bind(userProfileController));

// Delete user profile by user reference ID (must be before /:id)
router.delete('/user/:userRefId', userProfileController.deleteUserProfileByUserRefId.bind(userProfileController));

// Delete user profile by ID
router.delete('/:id', userProfileController.deleteUserProfile.bind(userProfileController));

export default router;

