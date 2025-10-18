import { Router } from 'express';
import { PetitionsController } from './controllers/petitions.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const petitionsController = new PetitionsController();

// POST /api/petitions - Create new petition (protected)
router.post('/', authGuard, (req, res) => petitionsController.create(req, res));

// PATCH /api/petitions/:code - Update petition (protected)
router.patch('/:code', authGuard, (req, res) => petitionsController.update(req, res));

export default router;

