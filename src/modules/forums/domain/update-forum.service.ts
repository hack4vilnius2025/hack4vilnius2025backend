import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';
import { User } from '../../auth/models/user.entity';

export interface UpdateForumInput {
  title?: string;
  body?: string;
}

export class UpdateForumService {
  async run(forumCode: string, userCode: string, input: UpdateForumInput): Promise<Forum> {
    const forumRepository = AppDataSource.getRepository(Forum);
    const userRepository = AppDataSource.getRepository(User);

    // Find forum by code
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    // Check if the user is the creator of the forum
    if (forum.userCode !== userCode) {
      throw new Error('Only the creator can update this forum');
    }

    // Update only provided fields
    if (input.title !== undefined) {
      forum.title = input.title;
    }
    if (input.body !== undefined) {
      forum.body = input.body;
    }

    // Save updated forum
    await forumRepository.save(forum);

    return forum;
  }
}
