import { AppDataSource } from '../../../data-source';
import { Comment } from '../models/comment.entity';
import { Forum } from '../models/forum.entity';

export interface CreateCommentInput {
  commentText: string;
}

export class CreateCommentService {
  async run(forumCode: string, userCode: string, input: CreateCommentInput): Promise<Comment> {
    const commentRepository = AppDataSource.getRepository(Comment);
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find forum by code
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    // Create new comment
    const comment = commentRepository.create({
      userCode: userCode,
      forum: forum,
      commentText: input.commentText,
    });

    // Save comment
    await commentRepository.save(comment);

    return comment;
  }
}
