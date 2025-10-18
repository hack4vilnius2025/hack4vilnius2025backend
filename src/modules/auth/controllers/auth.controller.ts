import { Request, Response } from 'express';
import { CreateUserService } from '../domain/create-user.service';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, address } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          error: 'Missing required fields: email, password, firstName, lastName',
        });
        return;
      }

      // Create user using the interactor
      const createUserService = new CreateUserService();
      const user = await createUserService.run({
        email,
        password,
        firstName,
        lastName,
        address,
      });

      // Return success response (excluding password)
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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

