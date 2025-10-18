import { AppDataSource } from '../../../data-source';
import { Forum } from '../models/forum.entity';

export interface PaginatedForumsResponse {
  forums: ForumWithApprovalCount[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ForumWithApprovalCount {
  code: string;
  userCode: string;
  userName: string;
  userImage: string | null;
  title: string;
  body: string;
  address: string | null;
  language: string;
  createdAt: Date;
  approvalCount: number;
}

export class GetPaginatedForumsService {
  async run(page: number, limit: number): Promise<PaginatedForumsResponse> {
    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    
    const forumRepository = AppDataSource.getRepository(Forum);
    
    // Calculate offset
    const skip = (validPage - 1) * validLimit;
    
    // Get forums with approval counts using query builder
    const query = forumRepository
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
      .skip(skip)
      .take(validLimit);
    
    const forums = await query.getRawMany();
    
    // Get total count for pagination metadata
    const totalItems = await forumRepository.count();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;
    
    // Format the response
    const formattedForums: ForumWithApprovalCount[] = forums.map((forum) => ({
      code: forum.forum_code,
      userCode: forum.forum_userCode,
      userName: forum.userName,
      userImage: forum.userImage,
      title: forum.forum_title,
      body: forum.forum_body,
      address: forum.forum_address,
      language: forum.forum_language,
      createdAt: forum.forum_createdAt,
      approvalCount: parseInt(forum.approvalCount) || 0,
    }));
    
    return {
      forums: formattedForums,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}

