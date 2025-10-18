import { Router } from 'express';
import { UsersController } from './controllers/users.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const usersController = new UsersController();

// PUT /api/users/profile - Update user profile (protected)
router.put('/profile', authGuard, (req, res) => usersController.updateProfile(req, res));

// PATCH /api/users/profile - Update user profile (protected)
router.patch('/profile', authGuard, (req, res) => usersController.updateProfile(req, res));

export default router;

