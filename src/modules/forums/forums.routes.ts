import { Router } from 'express';
import { ForumsController } from './controllers/forums.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const forumsController = new ForumsController();

// GET /api/forums - Get paginated forums with approval counts (public)
router.get('/', (req, res) => forumsController.getPaginatedForums(req, res));

// POST /api/forums - Create new forum (protected)
router.post('/', authGuard, (req, res) => forumsController.create(req, res));

// PATCH /api/forums/:code - Update forum (protected)
router.patch('/:code', authGuard, (req, res) => forumsController.update(req, res));

// DELETE /api/forums/:code - Delete forum (protected)
router.delete('/:code', authGuard, (req, res) => forumsController.delete(req, res));

// Export user-specific forums router for mounting at /api/users
export const userForumsRouter = Router();
// GET /api/users/forums - Get current user's forums (protected)
userForumsRouter.get('/forums', authGuard, (req, res) => forumsController.getUserForums(req, res));

export default router;

