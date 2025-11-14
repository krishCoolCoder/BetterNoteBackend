import { Router } from 'express';
import marriageBotController from './marriageBot.controller';

const router = Router();

// POST endpoint to get MarriageBot AI response
router.post('/chat', marriageBotController.getMarriageBotResponse.bind(marriageBotController));

export default router;

