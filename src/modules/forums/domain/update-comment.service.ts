import { AppDataSource } from '../../../data-source';
import { Comment } from '../models/comment.entity';

export interface UpdateCommentInput {
  commentText: string;
}

export class UpdateCommentService {
  async run(commentCode: string, userCode: string, input: UpdateCommentInput): Promise<Comment> {
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
      throw new Error('Unauthorized to update this comment');
    }

    // Update comment text
    comment.commentText = input.commentText;

    // Save updated comment
    await commentRepository.save(comment);

    return comment;
  }
}
