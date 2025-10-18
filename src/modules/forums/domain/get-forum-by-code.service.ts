import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';
import { User } from '../../auth/models/user.entity';

interface ForumWithUserInfo {
    code: string;
    userCode: string;
    userName: string;
    userImage: string | null;
    title: string;
    body: string;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class GetForumByCodeService {
  async run(forumCode: string): Promise<ForumWithUserInfo> {
    // Build query to join forum with user information
    const result = await AppDataSource
      .getRepository(Forum)
      .createQueryBuilder('forum')
      .innerJoin(User, 'user', 'user.code = forum.userCode')
      .select([
        'forum.code as code',
        'forum.userCode as userCode',
        'user.name as userName',
        'user.image as userImage',
        'forum.title as title',
        'forum.body as body',
        'forum.address as address',
        'forum.createdAt as createdAt',
        'forum.updatedAt as updatedAt'
      ])
      .where('forum.code = :forumCode', { forumCode })
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
      createdAt: result.createdat,
      updatedAt: result.updatedat
    };
  }
}
