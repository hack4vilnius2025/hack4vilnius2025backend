import { AppDataSource } from '../../../data-source';
import { ForumApproval } from '../models/forum-approval.entity';
import { Forum } from '../models/forum.entity';
import { User } from '../../auth/models/user.entity';

export class CreateForumApprovalService {
  async run(forumCode: string, userCode: string): Promise<ForumApproval> {
    const forumApprovalRepository = AppDataSource.getRepository(ForumApproval);
    const forumRepository = AppDataSource.getRepository(Forum);
    const userRepository = AppDataSource.getRepository(User);

    // Find forum by code
    const forum = await forumRepository.findOne({
      where: { code: forumCode },
    });

    if (!forum) {
      throw new Error('Forum not found');
    }

    // Find user by code to verify they exist
    const user = await userRepository.findOne({
      where: { code: userCode },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is trying to approve their own forum
    if (forum.userCode === userCode) {
      throw new Error('Cannot approve your own forum');
    }

    // Check if approval already exists
    const existingApproval = await forumApprovalRepository.findOne({
      where: {
        userCode: userCode,
        forum: { id: forum.id },
      },
    });

    if (existingApproval) {
      throw new Error('Forum already approved by this user');
    }

    // Create new forum approval
    const forumApproval = forumApprovalRepository.create({
      userCode: userCode,
      forum: forum,
    });

    // Save forum approval
    await forumApprovalRepository.save(forumApproval);

    return forumApproval;
  }
}
