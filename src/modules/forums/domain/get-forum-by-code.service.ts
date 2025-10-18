import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

export class GetForumByCodeService {
  async run(forumCode: string): Promise<Forum> {
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find forum by code
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    return forum;
  }
}
