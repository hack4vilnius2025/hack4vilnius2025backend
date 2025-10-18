import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

interface ForumWithUserInfo {
    code: string;
    userCode: string;
    userName: string;
    userImage: string | null;
    title: string;
    body: string;
    address: string | null;
    language: string;
    approvalCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export class GetForumByCodeService {
  async run(forumCode: string): Promise<ForumWithUserInfo> {
    // Build query to join forum with user information and count approvals
    const result = await AppDataSource
      .getRepository(Forum)
      .createQueryBuilder('forum')
      .leftJoin('users', 'user', 'user.code = forum.userCode')
      .leftJoin('forum_approvals', 'approval', 'approval.forum_id = forum.id')
      .select([
        'forum.code',
        'forum.userCode',
        'user.name as userName',
        'user.image as userImage',
        'forum.title',
        'forum.body',
        'forum.address',
        'forum.language',
        'COUNT(approval.id) as approvalCount',
        'forum.createdAt',
        'forum.updatedAt'
      ])
      .where('forum.code = :forumCode', { forumCode })
      .groupBy('forum.id')
      .addGroupBy('forum.code')
      .addGroupBy('forum.userCode')
      .addGroupBy('userName')
      .addGroupBy('userImage')
      .addGroupBy('forum.title')
      .addGroupBy('forum.body')
      .addGroupBy('forum.address')
      .addGroupBy('forum.language')
      .addGroupBy('forum.createdAt')
      .addGroupBy('forum.updatedAt')
      .getRawOne();

    if (!result) {
      throw new Error('Forum not found');
    }

    return {
      code: result.forum_code,
      userCode: result.forum_userCode,
      userName: result.userName,
      userImage: result.userImage,
      title: result.forum_title,
      body: result.forum_body,
      address: result.forum_address,
      language: result.forum_language,
      approvalCount: parseInt(result.approvalCount) || 0,
      createdAt: result.forum_createdAt,
      updatedAt: result.forum_updatedAt
    };
  }
}
