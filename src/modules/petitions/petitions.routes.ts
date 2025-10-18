import { Router } from 'express';
import { PetitionsController } from './controllers/petitions.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const petitionsController = new PetitionsController();

// POST /api/petitions - Create new petition (protected)
router.post('/', authGuard, (req, res) => petitionsController.create(req, res));

export default router;

