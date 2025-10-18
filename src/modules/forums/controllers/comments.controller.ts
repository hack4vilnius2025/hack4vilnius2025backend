import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreateCommentService } from '../domain/create-comment.service';

export class CommentsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { forumCode } = req.params;
      const { commentText } = req.body;

      // Validate required parameters
      if (!forumCode) {
        res.status(400).json({
          error: 'Missing required parameter: forumCode',
        });
        return;
      }

      // Validate required fields
      if (!commentText) {
        res.status(400).json({
          error: 'Missing required field: commentText',
        });
        return;
      }

      // Create comment using the service
      const createCommentService = new CreateCommentService();
      const comment = await createCommentService.run(forumCode, userCode, {
        commentText,
      });

      // Return success response
      res.status(201).json({
        code: comment.code,
        userCode: comment.userCode,
        forumCode: forumCode,
        commentText: comment.commentText,
        createdAt: comment.createdAt,
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
