import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

export class GetUserForumsService {
  async run(userCode: string): Promise<Forum[]> {
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find all forums by user code, ordered by creation date (newest first)
    const forums = await forumRepository.find({
      where: { userCode },
      order: { createdAt: 'DESC' },
    });

    return forums;
  }
}

