import { Router } from 'express';
import { PetitionApprovalsController } from './controllers/petition-approvals.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const petitionApprovalsController = new PetitionApprovalsController();

// POST /api/petitions/:petitionCode/approvals - Create petition approval (protected)
router.post('/:petitionCode/approvals', authGuard, (req, res) => petitionApprovalsController.create(req, res));

export default router;

