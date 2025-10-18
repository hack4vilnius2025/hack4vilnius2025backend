import { Request, Response } from 'express';
import { CreateUserService } from '../domain/create-user.service';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, address } = req.body;

      // Validate required fields
      if (!email || !password || !name) {
        res.status(400).json({
          error: 'Missing required fields: email, password, name',
        });
        return;
      }

      // Create user using the interactor
      const createUserService = new CreateUserService();
      const user = await createUserService.run({
        email,
        password,
        name,
        address,
      });

      // Return success response (excluding password)
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        createdAt: user.createdAt,
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

