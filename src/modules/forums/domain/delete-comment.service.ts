import { AppDataSource } from '../../../data-source';
import { Comment } from '../models/comment.entity';

export class DeleteCommentService {
  async run(commentCode: string, userCode: string): Promise<void> {
    const commentRepository = AppDataSource.getRepository(Comment);

    // Find comment by code
    const comment = await commentRepository.findOne({
      where: { code: commentCode },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check if the user is the creator of the comment
    if (comment.userCode !== userCode) {
      throw new Error('Unauthorized to delete this comment');
    }

    // Delete the comment
    await commentRepository.remove(comment);
  }
}
