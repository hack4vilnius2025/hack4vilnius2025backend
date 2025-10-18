import { AppDataSource } from '../../../data-source';
import { Comment } from '../models/comment.entity';
import { Forum } from '../models/forum.entity';
import { User } from '../../auth/models/user.entity';

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
      .innerJoin(User, 'user', 'user.code = comment.userCode')
      .select([
        'comment.code',
        'comment.userCode', 
        'comment.commentText',
        'comment.createdAt',
        'comment.updatedAt',
        'user.name',
        'user.image'
      ])
      .where('forum.code = :forumCode', { forumCode })
      .orderBy('comment.createdAt', 'ASC')
      .getRawMany();

    // Map comments to the response format
    return comments.map(comment => ({
      code: comment.comment_code,
      userCode: comment.comment_userCode,
      userName: comment.user_name,
      userImage: comment.user_image,
      commentText: comment.comment_commentText,
      createdAt: comment.comment_createdAt,
      updatedAt: comment.comment_updatedAt,
    }));
  }
}
