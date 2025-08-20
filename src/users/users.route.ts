import { Router } from 'express';
import userController from './users.controller';

const router = Router();

// Create a new user
router.post('/', userController.createUser.bind(userController));

// User login
router.post('/login', userController.loginUser.bind(userController));

// Get all users
router.get('/', userController.getAllUsers.bind(userController));

// Get user by ID
router.get('/:id', userController.getUserById.bind(userController));

// Get user by email
router.get('/email/:email', userController.getUserByEmail.bind(userController));

// Get user by username
router.get('/username/:username', userController.getUserByUsername.bind(userController));

// Update user
router.put('/:id', userController.updateUser.bind(userController));

// Delete user
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;