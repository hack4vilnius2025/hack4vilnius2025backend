import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { GetLLMResponseService } from '../domain/get-llm-response.service';

export class AgentController {
  async generateResponse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      // Validate required fields
      if (!prompt) {
        res.status(400).json({
          error: 'Missing required field: prompt',
        });
        return;
      }

      // Generate LLM response using the service
      const llmService = new GetLLMResponseService();
      const response = await llmService.run({
        prompt,
      });

      // Return success response
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('GEMINI_API_KEY')) {
          res.status(500).json({ error: 'AI service not configured' });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
