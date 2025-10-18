import { AppDataSource } from '../../../data-source';
import { User } from '../models/user.entity';

export class GetUserService {
  async run(userCode: string): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    // Find user by code
    const user = await userRepository.findOne({
      where: { code: userCode },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

