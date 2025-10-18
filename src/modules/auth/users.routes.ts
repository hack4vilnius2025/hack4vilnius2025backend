import { Router } from 'express';
import { UsersController } from './controllers/users.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const usersController = new UsersController();

// GET /api/users - Get current user profile (protected)
router.get('/', authGuard, (req, res) => usersController.getProfile(req, res));

// PUT /api/users - Update user profile (protected)
router.put('/', authGuard, (req, res) => usersController.updateProfile(req, res));

// PATCH /api/users - Partially update user profile (protected)
router.patch('/', authGuard, (req, res) => usersController.updateProfile(req, res));

export default router;

