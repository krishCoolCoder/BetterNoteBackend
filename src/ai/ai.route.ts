import { Router } from 'express';
import aiController from './ai.controller';

const router = Router();

// Get AI response for text
router.post('/chat', aiController.getAIResponse.bind(aiController));

// Test AI integration
router.get('/test', aiController.testAI.bind(aiController));

export default router;