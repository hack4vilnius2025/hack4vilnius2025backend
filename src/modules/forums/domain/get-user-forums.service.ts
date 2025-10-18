import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

export interface UserForumWithUserInfo {
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
}

export class GetUserForumsService {
  async run(userCode: string): Promise<UserForumWithUserInfo[]> {
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find all forums by user code with user info and approval counts, ordered by creation date (newest first)
    const forums = await forumRepository
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
        'forum.createdAt',
        'COUNT(approval.id) as approvalCount'
      ])
      .where('forum.userCode = :userCode', { userCode })
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
      .orderBy('forum.createdAt', 'DESC')
      .getRawMany();

    // Format the response
    return forums.map((forum) => ({
      code: forum.forum_code,
      userCode: forum.forum_userCode,
      userName: forum.userName,
      userImage: forum.userImage,
      title: forum.forum_title,
      body: forum.forum_body,
      address: forum.forum_address,
      language: forum.forum_language,
      approvalCount: parseInt(forum.approvalCount) || 0,
      createdAt: forum.forum_createdAt,
    }));
  }
}

