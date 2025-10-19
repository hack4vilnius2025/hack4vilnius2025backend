import { Router } from 'express';
import { PetitionsController } from './controllers/petitions.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const petitionsController = new PetitionsController();

// GET /api/petitions - Get paginated petitions with approval counts (public)
router.get('/', (req, res) => petitionsController.getPaginatedPetitions(req, res));

// POST /api/petitions - Create new petition (protected)
router.post('/', authGuard, (req, res) => petitionsController.create(req, res));

// PATCH /api/petitions/:code - Update petition (protected)
router.patch('/:code', authGuard, (req, res) => petitionsController.update(req, res));

// DELETE /api/petitions/:code - Delete petition (protected)
router.delete('/:code', authGuard, (req, res) => petitionsController.delete(req, res));

export default router;

