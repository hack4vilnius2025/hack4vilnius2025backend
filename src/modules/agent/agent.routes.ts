import { Router } from 'express';
import { AgentController } from './controllers/agent.controller';
import { authGuard } from '../../middleware/auth.middleware';

const router = Router();
const agentController = new AgentController();

// POST /api/agent/generate - Generate LLM response (protected)
router.post('/generate', authGuard, (req, res) => agentController.generateResponse(req, res));

export default router;
