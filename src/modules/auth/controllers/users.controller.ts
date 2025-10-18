import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { UpdateUserService } from '../domain/update-user.service';
import { SoftDeleteUserService } from '../domain/soft-delete-user.service';

export class UsersController {
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { name, address, image } = req.body;

      // Update user using the interactor
      const updateUserService = new UpdateUserService();
      const user = await updateUserService.run(userCode, {
        name,
        address,
        image,
      });

      // Return success response (excluding password and id)
      res.status(200).json({
        code: user.code,
        email: user.email,
        name: user.name,
        address: user.address,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async softDelete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized'});
        return;
      }

      const softDeleteUserService = new SoftDeleteUserService();
      softDeleteUserService.run(userCode);

      res.status(204);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}

