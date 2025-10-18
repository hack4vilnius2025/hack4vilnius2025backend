import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';
import { User } from '../../auth/models/user.entity';
import { ForumApproval } from '../models/forum-approval.entity';

interface ForumWithUserInfo {
    code: string;
    userCode: string;
    userName: string;
    userImage: string | null;
    title: string;
    body: string;
    address: string | null;
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
      .innerJoin(User, 'user', 'user.code = forum.userCode')
      .leftJoin(ForumApproval, 'approval', 'approval.forum = forum.id')
      .select([
        'forum.code as code',
        'forum.userCode as userCode',
        'user.name as userName',
        'user.image as userImage',
        'forum.title as title',
        'forum.body as body',
        'forum.address as address',
        'COUNT(approval.id) as approvalCount',
        'forum.createdAt as createdAt',
        'forum.updatedAt as updatedAt'
      ])
      .where('forum.code = :forumCode', { forumCode })
      .groupBy('forum.id, forum.code, forum.userCode, user.name, user.image, forum.title, forum.body, forum.address, forum.createdAt, forum.updatedAt')
      .getRawOne();

    if (!result) {
      throw new Error('Forum not found');
    }

    return {
      code: result.code,
      userCode: result.usercode,
      userName: result.username,
      userImage: result.userimage,
      title: result.title,
      body: result.body,
      address: result.address,
      approvalCount: parseInt(result.approvalcount) || 0,
      createdAt: result.createdat,
      updatedAt: result.updatedat
    };
  }
}
