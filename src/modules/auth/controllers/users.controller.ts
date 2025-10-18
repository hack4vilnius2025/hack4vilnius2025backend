import { Response } from 'express';
import { AuthRequest } from '../../../middleware/auth.middleware';
import { UpdateUserService } from '../domain/update-user.service';
import { GetUserService } from '../domain/get-user.service';

export class UsersController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userCode = req.userCode;

      if (!userCode) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get user using the interactor
      const getUserService = new GetUserService();
      const user = await getUserService.run(userCode);

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
}

