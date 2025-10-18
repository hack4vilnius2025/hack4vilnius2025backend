import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreateForumService } from '../domain/create-forum.service';

export class ForumsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, body } = req.body;

      // Validate required fields
      if (!title || !body) {
        res.status(400).json({
          error: 'Missing required fields: title, body',
        });
        return;
      }

      // Create forum using the interactor
      const createForumService = new CreateForumService();
      const forum = await createForumService.run(userCode, {
        title,
        body,
      });

      // Return success response (excluding id)
      res.status(201).json({
        code: forum.code,
        userCode: forum.userCode,
        title: forum.title,
        body: forum.body,
        createdAt: forum.createdAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

