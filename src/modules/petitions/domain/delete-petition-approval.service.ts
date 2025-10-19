import { AppDataSource } from '../../../data-source';
import { Petition } from '../models/petition.entity';
import { PetitionApproval } from '../models/petition-approval.entity';
import { User } from '../../auth/models/user.entity';

export class DeletePetitionApprovalService {
  async run(petitionCode: string, userCode: string): Promise<void> {
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

    // Find the approval
    const approval = await petitionApprovalRepository.findOne({
      where: {
        userCode,
        petition: { id: petition.id },
      },
    });

    if (!approval) {
      throw new Error('Petition approval not found');
    }

    // Delete the approval
    await petitionApprovalRepository.remove(approval);
  }
}

