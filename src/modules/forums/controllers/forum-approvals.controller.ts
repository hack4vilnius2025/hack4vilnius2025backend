import { Response } from 'express';
import { AuthRequest } from "../../../middleware/auth.middleware";
import { CreateForumApprovalService } from "../domain/create-forum-approval.service";
import { DeleteForumApprovalService } from "../domain/delete-forum-approval.service";

export class ForumApprovalsController {
    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
          const userCode = req.userCode;
    
          if (!userCode) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
          }
    
          const { forumCode } = req.params;
    
          // Validate required parameter
          if (!forumCode) {
            res.status(400).json({
              error: 'Missing required parameter: forumCode',
            });
            return;
          }
    
          // Create forum approval using the service
          const createForumApprovalService = new CreateForumApprovalService();
          const forumApproval = await createForumApprovalService.run(forumCode, userCode);
    
          // Return success response
          res.status(201).json({
            userCode: forumApproval.userCode,
            forumCode: forumCode,
            createdAt: forumApproval.createdAt,
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Forum not found') {
              res.status(404).json({ error: error.message });
            } else if (error.message === 'User not found') {
              res.status(404).json({ error: error.message });
            } else if (error.message === 'Cannot approve your own forum') {
              res.status(403).json({ error: error.message });
            } else if (error.message === 'Forum already approved by this user') {
              res.status(409).json({ error: error.message });
            } else {
              res.status(400).json({ error: error.message });
            }
          } else {
            res.status(500).json({ error: 'Internal server error' });
          }
        }
      }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
          const userCode = req.userCode;
    
          if (!userCode) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
          }
    
          const { forumCode } = req.params;
    
          // Validate required parameter
          if (!forumCode) {
            res.status(400).json({
              error: 'Missing required parameter: forumCode',
            });
            return;
          }
    
          // Delete forum approval using the service
          const deleteForumApprovalService = new DeleteForumApprovalService();
          await deleteForumApprovalService.run(forumCode, userCode);
    
          // Return success response
          res.status(200).json({
            message: 'Forum approval deleted successfully',
          });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Forum not found') {
              res.status(404).json({ error: error.message });
            } else if (error.message === 'User not found') {
              res.status(404).json({ error: error.message });
            } else if (error.message === 'Forum approval not found') {
              res.status(404).json({ error: error.message });
            } else {
              res.status(400).json({ error: error.message });
            }
          } else {
            res.status(500).json({ error: 'Internal server error' });
          }
        }
      }
}
