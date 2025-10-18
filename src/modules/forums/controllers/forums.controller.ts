import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreateForumService } from '../domain/create-forum.service';
import { DeleteForumService } from '../domain/delete-forum.service';
import { GetUserForumsService } from '../domain/get-user-forums.service';

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

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { code } = req.params;

      // Validate required parameter
      if (!code) {
        res.status(400).json({
          error: 'Missing required parameter: code',
        });
        return;
      }

      // Delete forum using the interactor
      const deleteForumService = new DeleteForumService();
      await deleteForumService.run(code, userCode);

      // Return success response
      res.status(200).json({
        message: 'Forum deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          res.status(403).json({ error: error.message });
        } else if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getUserForums(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get user's forums using the interactor
      const getUserForumsService = new GetUserForumsService();
      const forums = await getUserForumsService.run(userCode);

      // Return success response (excluding id and deletedAt)
      res.status(200).json(
        forums.map((forum) => ({
          code: forum.code,
          userCode: forum.userCode,
          title: forum.title,
          body: forum.body,
          createdAt: forum.createdAt
        }))
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

