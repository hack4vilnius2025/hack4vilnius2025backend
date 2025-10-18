import { AppDataSource } from '../../../data-source';
import { ForumApproval } from '../models/forum-approval.entity';
import { Forum } from '../models/forum.entity';

export class DeleteForumApprovalService {
  async run(forumCode: string, userCode: string): Promise<void> {
    const forumApprovalRepository = AppDataSource.getRepository(ForumApproval);
    // Find existing approval by userCode and forumCode
    const existingApproval = await forumApprovalRepository.findOne({
      where: {
        userCode: userCode,
        forum: { code: forumCode },
      },
    });

    if (!existingApproval) {
      throw new Error('Forum approval not found');
    }

    // Delete the forum approval
    await forumApprovalRepository.remove(existingApproval);
  }
}
