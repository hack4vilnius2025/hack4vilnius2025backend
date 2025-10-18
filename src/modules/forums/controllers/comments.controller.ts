import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreateCommentService } from '../domain/create-comment.service';
import { UpdateCommentService } from '../domain/update-comment.service';
import { DeleteCommentService } from '../domain/delete-comment.service';
import { GetCommentsByForumCodeService } from '../domain/get-comments-by-forum-code.service';

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

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { commentCode } = req.params;
      const { commentText } = req.body;

      // Validate required parameters
      if (!commentCode) {
        res.status(400).json({
          error: 'Missing required parameter: commentCode',
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

      // Update comment using the service
      const updateCommentService = new UpdateCommentService();
      const updatedComment = await updateCommentService.run(commentCode, userCode, {
        commentText,
      });

      // Return success response
      res.status(200).json({
        code: updatedComment.code,
        userCode: updatedComment.userCode,
        commentText: updatedComment.commentText,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Comment not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Unauthorized to update this comment') {
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

      const { commentCode } = req.params;

      // Validate required parameters
      if (!commentCode) {
        res.status(400).json({
          error: 'Missing required parameter: commentCode',
        });
        return;
      }

      // Delete comment using the service
      const deleteCommentService = new DeleteCommentService();
      await deleteCommentService.run(commentCode, userCode);

      // Return success response
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Comment not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Unauthorized to delete this comment') {
          res.status(403).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getByForumCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { forumCode } = req.params;

      // Validate required parameters
      if (!forumCode) {
        res.status(400).json({
          error: 'Missing required parameter: forumCode',
        });
        return;
      }

      // Get comments using the service
      const getCommentsService = new GetCommentsByForumCodeService();
      const comments = await getCommentsService.run(forumCode);

      // Return success response
      res.status(200).json(comments);
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
