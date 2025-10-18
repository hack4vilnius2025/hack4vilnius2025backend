import { Request, Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreateForumService } from '../domain/create-forum.service';
import { UpdateForumService } from '../domain/update-forum.service';
import { DeleteForumService } from '../domain/delete-forum.service';
import { GetUserForumsService } from '../domain/get-user-forums.service';
import { GetPaginatedForumsService } from '../domain/get-paginated-forums.service';
import { GetForumByCodeService } from '../domain/get-forum-by-code.service';

export class ForumsController {
  async getPaginatedForums(req: Request, res: Response): Promise<void> {
    try {
      // Parse pagination parameters from query string
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Get paginated forums with approval counts
      const getPaginatedForumsService = new GetPaginatedForumsService();
      const result = await getPaginatedForumsService.run(page, limit);

      // Return success response
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, body, address, language } = req.body;

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
        address,
        language,
      });

      // Return success response (excluding id)
      res.status(201).json({
        code: forum.code,
        userCode: forum.userCode,
        title: forum.title,
        body: forum.body,
        address: forum.address,
        language: forum.language,
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
      const { code } = req.params;
      const { title, body, address, language } = req.body;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!code) {
        res.status(400).json({ error: 'Forum code is required' });
        return;
      }

      // At least one field must be provided for update
      if (!title && !body && !address && !language) {
        res.status(400).json({
          error: 'At least one field (title, body, address, or language) must be provided for update',
        });
        return;
      }

      // Update forum using the service
      const updateForumService = new UpdateForumService();
      const forum = await updateForumService.run(code, userCode, {
        title,
        body,
        address,
        language,
      });

      // Return success response (excluding id)
      res.status(200).json({
        code: forum.code,
        userCode: forum.userCode,
        title: forum.title,
        body: forum.body,
        address: forum.address,
        language: forum.language,
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

      // Return success response (service already returns formatted data)
      res.status(200).json(forums);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      // Validate required parameter
      if (!code) {
        res.status(400).json({
          error: 'Missing required parameter: code',
        });
        return;
      }

      // Get forum by code using the service
      const getForumByCodeService = new GetForumByCodeService();
      const forum = await getForumByCodeService.run(code);

      // Return success response with user information and approval count
      res.status(200).json({
        code: forum.code,
        userCode: forum.userCode,
        userName: forum.userName,
        userImage: forum.userImage,
        title: forum.title,
        body: forum.body,
        address: forum.address,
        language: forum.language,
        approvalCount: forum.approvalCount,
        createdAt: forum.createdAt,
        updatedAt: forum.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Forum not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

