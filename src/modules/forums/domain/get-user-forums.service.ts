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
  createdAt: Date;
}

export class GetUserForumsService {
  async run(userCode: string): Promise<UserForumWithUserInfo[]> {
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find all forums by user code with user info, ordered by creation date (newest first)
    const forums = await forumRepository
      .createQueryBuilder('forum')
      .leftJoin('users', 'user', 'user.code = forum.userCode')
      .select([
        'forum.code',
        'forum.userCode',
        'user.name as userName',
        'user.image as userImage',
        'forum.title',
        'forum.body',
        'forum.address',
        'forum.createdAt',
      ])
      .where('forum.userCode = :userCode', { userCode })
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
      createdAt: forum.forum_createdAt,
    }));
  }
}

