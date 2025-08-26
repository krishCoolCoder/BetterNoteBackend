import { Request, Response } from 'express';
import { callOpenAI } from './openaiClient';

export class AIController {
  // Get AI response for given text
  async getAIResponse(req: Request, res: Response): Promise<void> {
    try {
      const { text } = req.body;

      // Validation
      if (!text || typeof text !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Text field is required in request body and must be a string'
        });
        return;
      }

      if (text.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Text field cannot be empty'
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

      // Call OpenAI API
      const aiResponse = await callOpenAI(text.trim());

      res.status(200).json({
        success: true,
        message: 'AI response generated successfully',
        data: {
          input: text.trim(),
          response: JSON.parse(aiResponse),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
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
          message: 'Invalid request to OpenAI API'
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || 'Internal server error while processing AI request'
        });
      }
    }
  }

  // Test endpoint to verify AI integration
  async testAI(req: Request, res: Response): Promise<void> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        res.status(500).json({
          success: false,
          message: 'OpenAI API key not configured'
        });
        return;
      }

      const testMessage = "Hello! Please respond with 'AI integration is working correctly.'";
      const aiResponse = await callOpenAI(testMessage);

      res.status(200).json({
        success: true,
        message: 'AI test completed successfully',
        data: {
          test: true,
          input: testMessage,
          response: aiResponse,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('Error testing AI:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'AI test failed'
      });
    }
  }
}

export default new AIController();