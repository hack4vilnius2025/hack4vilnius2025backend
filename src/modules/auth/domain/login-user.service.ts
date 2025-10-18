import { AppDataSource } from '../../../data-source';
import { User } from '../models/user.entity';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  accessToken: string;
}

export class LoginUserService {
  async run(input: LoginUserInput): Promise<LoginUserOutput> {
    const userRepository = AppDataSource.getRepository(User);

    // Find user by email
    const user = await userRepository.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const accessToken = jwt.sign(
      { userCode: user.code, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return {
      accessToken,
    };
  }
}

