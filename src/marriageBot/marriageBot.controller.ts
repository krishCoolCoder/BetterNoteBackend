import { Request, Response } from 'express';
import { callMarriageBotAI } from './marriageBotClient';

export class MarriageBotController {
  // Get AI response for marriage bot
  async getMarriageBotResponse(req: Request, res: Response): Promise<void> {
    try {
      const { messages } = req.body;

      // Validation
      if (!messages || typeof messages !== 'string') {
        res.status(400).json({
          success: false,
          message: 'messages field is required in request body and must be a string'
        });
        return;
      }

      if (messages.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'messages field cannot be empty'
        });
        return;
      }

      // Character limit validation - 150 characters max
      if (messages.length > 150) {
        res.status(400).json({
          success: false,
          message: 'messages field cannot exceed 150 characters',
          details: `Current length: ${messages.length} characters. Maximum allowed: 150 characters.`
        });
        return;
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        res.status(500).json({
          success: false,
          message: 'OpenAI API key not configured'
        });
        return;
      }

      console.log('📨 MarriageBot Request:', messages.trim().substring(0, 100) + '...');

      // Call OpenAI API with custom MarriageBot client
      const aiResponse = await callMarriageBotAI(messages.trim());

      console.log('✅ MarriageBot Response received');

      res.status(200).json({
        success: true,
        message: 'MarriageBot response generated successfully',
        data: {
          input: messages.trim(),
          response: aiResponse,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('❌ Error in MarriageBot:', error);
      
      // Handle specific OpenAI errors
      if (error.status === 401) {
        res.status(401).json({
          success: false,
          message: 'Invalid OpenAI API key'
        });
      } else if (error.status === 429) {
        res.status(429).json({
          success: false,
          message: 'OpenAI API rate limit exceeded. Please try again later.'
        });
      } else if (error.status === 400) {
        res.status(400).json({
          success: false,
          message: 'Invalid request to OpenAI API',
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || 'Internal server error while processing MarriageBot request'
        });
      }
    }
  }
}

export default new MarriageBotController();

