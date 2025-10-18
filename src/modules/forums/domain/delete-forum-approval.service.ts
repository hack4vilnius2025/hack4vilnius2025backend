import { AppDataSource } from '../../../data-source';
import { ForumApproval } from '../models/forum-approval.entity';
import { Forum } from '../models/forum.entity';

export class DeleteForumApprovalService {
  async run(forumCode: string, userCode: string): Promise<void> {
    const forumApprovalRepository = AppDataSource.getRepository(ForumApproval);
    const forumRepository = AppDataSource.getRepository(Forum);

    // Find forum by code
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    // Find existing approval
    const existingApproval = await forumApprovalRepository.findOne({
      where: {
        userCode: userCode,
        forum: { id: forum.id },
      },
    });

    if (!existingApproval) {
      throw new Error('Forum approval not found');
    }

    // Delete the forum approval
    await forumApprovalRepository.remove(existingApproval);
  }
}
