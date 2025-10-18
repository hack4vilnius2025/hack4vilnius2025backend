import { Router } from "express";
import { ForumApprovalsController } from "./controllers/forum-approvals.controller";
import { authGuard } from "../../middleware/auth.middleware";

const router = Router();
const forumApprovalsController = new ForumApprovalsController();

// POST /api/forums/:forumCode/approvals - Create forum approval (protected)
router.post('/:forumCode/approvals', authGuard, (req, res) => forumApprovalsController.create(req, res));

// DELETE /api/forums/:forumCode/approvals - Delete forum approval (protected)
router.delete('/:forumCode/approvals', authGuard, (req, res) => forumApprovalsController.delete(req, res));

export default router;
