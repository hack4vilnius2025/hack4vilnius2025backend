import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

export interface CreateForumInput {
  title: string;
  body: string;
  address?: string;
}

export class CreateForumService {
  async run(userCode: string, input: CreateForumInput): Promise<Forum> {
    const forumRepository = AppDataSource.getRepository(Forum);

    // Create new forum
    const forum = forumRepository.create({
      userCode,
      title: input.title,
      body: input.body,
      address: input.address,
    });

    // Save forum to database
    await forumRepository.save(forum);

    return forum;
  }
}

