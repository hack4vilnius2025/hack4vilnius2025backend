import { AppDataSource } from '../../../data-source';
import { Petition } from '../models/petition.entity';
import { PetitionApproval } from '../models/petition-approval.entity';
import { User } from '../../auth/models/user.entity';

export class CreatePetitionApprovalService {
  async run(petitionCode: string, userCode: string): Promise<{ petitionCode: string; userCode: string; createdAt: Date }> {
    const petitionRepository = AppDataSource.getRepository(Petition);
    const petitionApprovalRepository = AppDataSource.getRepository(PetitionApproval);
    const userRepository = AppDataSource.getRepository(User);

    // Verify user exists
    const user = await userRepository.findOne({
      where: { code: userCode },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify petition exists
    const petition = await petitionRepository.findOne({
      where: { code: petitionCode },
    });

    if (!petition) {
      throw new Error('Petition not found');
    }

    // Check if user is trying to approve their own petition
    if (petition.userCode === userCode) {
      throw new Error('Cannot approve your own petition');
    }

    // Check if approval already exists
    const existingApproval = await petitionApprovalRepository.findOne({
      where: {
        userCode,
        petition: { id: petition.id },
      },
    });

    if (existingApproval) {
      throw new Error('Petition already approved by this user');
    }

    // Create new approval
    const approval = petitionApprovalRepository.create({
      userCode,
      petition,
    });

    await petitionApprovalRepository.save(approval);

    return {
      petitionCode: petition.code,
      userCode,
      createdAt: approval.createdAt,
    };
  }
}

