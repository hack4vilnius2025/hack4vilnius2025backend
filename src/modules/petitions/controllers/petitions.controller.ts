import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { CreatePetitionService } from '../domain/create-petition.service';

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
}

