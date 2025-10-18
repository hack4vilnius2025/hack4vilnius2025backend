import { AppDataSource } from '../../../data-source';
import { Forum, ForumLanguage } from '../models/forum.entity';

export interface CreateForumInput {
  title: string;
  body: string;
  address?: string;
  language?: ForumLanguage;
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
      language: input.language || ForumLanguage.EN,
    });

    // Save forum to database
    await forumRepository.save(forum);

    return forum;
  }
}

