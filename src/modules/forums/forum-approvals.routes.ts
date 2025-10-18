import { Router } from "express";
import { ForumApprovalsController } from "./controllers/forum-approvals.controller";
import { authGuard } from "../../middleware/auth.middleware";

const router = Router();
const forumApprovalsController = new ForumApprovalsController();

// POST /api/forums/:forumCode - Create forum approval (protected)
router.post('/:forumCode/approvals', authGuard, (req, res) => forumApprovalsController.create(req, res));

export default router;
