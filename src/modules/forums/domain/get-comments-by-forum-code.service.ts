import { AppDataSource } from '../../../data-source';
import { Comment } from '../models/comment.entity';
import { Forum } from '../models/forum.entity';

export interface CommentWithUser {
  code: string;
  userCode: string;
  userName: string;
  userImage: string | null;
  commentText: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetCommentsByForumCodeService {
  async run(forumCode: string): Promise<CommentWithUser[]> {
    const commentRepository = AppDataSource.getRepository(Comment);
    const forumRepository = AppDataSource.getRepository(Forum);

    // First, verify that the forum exists
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    // Get comments for the forum with user information, ordered by creation date (oldest first)
    const comments = await commentRepository
      .createQueryBuilder('comment')
      .innerJoin('comment.forum', 'forum')
      .leftJoin('users', 'user', 'user.code = comment.userCode')
      .select([
        'comment.code',
        'comment.userCode', 
        'user.name as userName',
        'user.image as userImage',
        'comment.commentText',
        'comment.createdAt',
        'comment.updatedAt'
      ])
      .where('forum.code = :forumCode', { forumCode })
      .orderBy('comment.createdAt', 'ASC')
      .getRawMany();

    // Map comments to the response format
    return comments.map(comment => ({
      code: comment.comment_code,
      userCode: comment.comment_user_code,
      userName: comment.userName,
      userImage: comment.userImage,
      commentText: comment.comment_comment_text,
      createdAt: comment.comment_created_at,
      updatedAt: comment.comment_updated_at,
    }));
  }
}
