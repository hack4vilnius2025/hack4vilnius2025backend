import { AppDataSource } from '../../../data-source';
import { User } from '../models/user.entity';

export interface UpdateUserInput {
  name?: string;
  address?: string;
  image?: string;
}

export class UpdateUserService {
  async run(userCode: string, input: UpdateUserInput): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    // Find user by code
    const user = await userRepository.findOne({
      where: { code: userCode },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update only provided fields
    if (input.name !== undefined) {
      user.name = input.name;
    }
    if (input.address !== undefined) {
      user.address = input.address;
    }
    if (input.image !== undefined) {
      user.image = input.image;
    }

    // Save updated user
    await userRepository.save(user);

    return user;
  }
}

