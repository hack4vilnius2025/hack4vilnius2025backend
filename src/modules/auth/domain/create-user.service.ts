import { AppDataSource } from '../../../data-source';
import { User } from '../models/user.entity';
import bcrypt from 'bcryptjs';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  address?: string;
}

export class CreateUserService {
  async run(input: CreateUserInput): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create new user
    const user = userRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
      address: input.address,
    });

    // Save user to database
    await userRepository.save(user);

    return user;
  }
}
