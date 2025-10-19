import { Router } from 'express';
import { CommentsController } from './controllers/comments.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const commentsController = new CommentsController();

// GET /api/forums/:forumCode/comments - Get all comments for a forum (public)
router.get('/:forumCode/comments', (req, res) => commentsController.getByForumCode(req, res));

// POST /api/forums/:forumCode/comments - Create new comment (protected)
router.post('/:forumCode/comments', authGuard, (req, res) => commentsController.create(req, res));

// PATCH /api/forums/comments/:commentCode - Update comment (protected)
router.patch('/comments/:commentCode', authGuard, (req, res) => commentsController.update(req, res));

// DELETE /api/forums/comments/:commentCode - Delete comment (protected)
router.delete('/comments/:commentCode', authGuard, (req, res) => commentsController.delete(req, res));

export default router;
