import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreateForumService } from '../domain/create-forum.service';
import { UpdateForumService } from '../domain/update-forum.service';

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

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;
      const { forumCode } = req.params;
      const { title, body } = req.body;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!forumCode) {
        res.status(400).json({ error: 'Forum code is required' });
        return;
      }

      // At least one field must be provided for update
      if (!title && !body) {
        res.status(400).json({
          error: 'At least one field (title or body) must be provided for update',
        });
        return;
      }

      // Update forum using the service
      const updateForumService = new UpdateForumService();
      const forum = await updateForumService.run(forumCode, userCode, {
        title,
        body,
      });

      // Return success response (excluding id)
      res.status(200).json({
        code: forum.code,
        userCode: forum.userCode,
        title: forum.title,
        body: forum.body,
        createdAt: forum.createdAt,
        updatedAt: forum.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Forum not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Only the creator can update this forum') {
          res.status(403).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

