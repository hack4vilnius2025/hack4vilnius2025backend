import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreatePetitionService } from '../domain/create-petition.service';
import { UpdatePetitionService } from '../domain/update-petition.service';
import { DeletePetitionService } from '../domain/delete-petition.service';

export class PetitionsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { name, description, address } = req.body;

      // Validate required fields
      if (!name || !description) {
        res.status(400).json({
          error: 'Missing required fields: name, description',
        });
        return;
      }

      // Create petition using the interactor
      const createPetitionService = new CreatePetitionService();
      const petition = await createPetitionService.run(userCode, {
        name,
        description,
        address,
      });

      // Return success response (excluding id)
      res.status(201).json({
        code: petition.code,
        userCode: petition.userCode,
        name: petition.name,
        description: petition.description,
        address: petition.address,
        createdAt: petition.createdAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;
      const { code } = req.params;
      const { name, description, address } = req.body;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!code) {
        res.status(400).json({ error: 'Petition code is required' });
        return;
      }

      // At least one field must be provided for update
      if (!name && !description && !address) {
        res.status(400).json({
          error: 'At least one field (name, description, or address) must be provided for update',
        });
        return;
      }

      // Update petition using the service
      const updatePetitionService = new UpdatePetitionService();
      const petition = await updatePetitionService.run(code, userCode, {
        name,
        description,
        address,
      });

      // Return success response (excluding id)
      res.status(200).json({
        code: petition.code,
        userCode: petition.userCode,
        name: petition.name,
        description: petition.description,
        address: petition.address,
        createdAt: petition.createdAt,
        updatedAt: petition.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Petition not found') {
          res.status(404).json({ error: error.message });
        } else if (error.message === 'Only the creator can update this petition') {
          res.status(403).json({ error: error.message });
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

      const { code } = req.params;

      // Validate required parameter
      if (!code) {
        res.status(400).json({
          error: 'Missing required parameter: code',
        });
        return;
      }

      // Delete petition using the interactor
      const deletePetitionService = new DeletePetitionService();
      await deletePetitionService.run(code, userCode);

      // Return success response (204 No Content)
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          res.status(403).json({ error: error.message });
        } else if (error.message.includes('not found')) {
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

