import { Router } from 'express';
import { CommentsController } from './controllers/comments.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const commentsController = new CommentsController();

// POST /api/forums/:forumCode/comments - Create new comment (protected)
router.post('/:forumCode/comments', authGuard, (req, res) => commentsController.create(req, res));

export default router;
