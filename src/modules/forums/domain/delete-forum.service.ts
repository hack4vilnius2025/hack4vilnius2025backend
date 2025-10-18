import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

export class DeleteForumService {
  async run(forumCode: string, userCode: string): Promise<void> {
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find forum by code
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    // Check if user is the owner of the forum
    if (forum.userCode !== userCode) {
      throw new Error('Unauthorized: You can only delete your own forums');
    }

    // Hard delete the forum
    await forumRepository.remove(forum);
  }
}

