import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreatePetitionApprovalService } from '../domain/create-petition-approval.service';
import { DeletePetitionApprovalService } from '../domain/delete-petition-approval.service';

export class PetitionApprovalsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { petitionCode } = req.params;

      // Validate required parameter
      if (!petitionCode) {
        res.status(400).json({
          error: 'Missing required parameter: petitionCode',
        });
        return;
      }

      // Create petition approval using the interactor
      const createPetitionApprovalService = new CreatePetitionApprovalService();
      const approval = await createPetitionApprovalService.run(petitionCode, userCode);

      // Return success response
      res.status(201).json({
        userCode: approval.userCode,
        petitionCode: approval.petitionCode,
        createdAt: approval.createdAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found' || error.message === 'Petition not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Cannot approve your own petition') {
          res.status(403).json({ error: error.message });
        } else if (error.message === 'Petition already approved by this user') {
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

      const { petitionCode } = req.params;

      // Validate required parameter
      if (!petitionCode) {
        res.status(400).json({
          error: 'Missing required parameter: petitionCode',
        });
        return;
      }

      // Delete petition approval using the interactor
      const deletePetitionApprovalService = new DeletePetitionApprovalService();
      await deletePetitionApprovalService.run(petitionCode, userCode);

      // Return success response (204 No Content)
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
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

