import { Router } from 'express';
import { ForumsController } from './controllers/forums.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const forumsController = new ForumsController();

// POST /api/forums - Create new forum (protected)
router.post('/', authGuard, (req, res) => forumsController.create(req, res));

// DELETE /api/forums/:code - Delete forum (protected)
router.delete('/:code', authGuard, (req, res) => forumsController.delete(req, res));

export default router;

