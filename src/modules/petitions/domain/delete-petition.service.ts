import { AppDataSource } from '../../../data-source';
import { Petition } from '../models/petition.entity';

export class DeletePetitionService {
  async run(petitionCode: string, userCode: string): Promise<void> {
    const petitionRepository = AppDataSource.getRepository(Petition);

    // Find petition by code
    const petition = await petitionRepository.findOne({
      where: { code: petitionCode },
    });

    if (!petition) {
      throw new Error('Petition not found');
    }

    // Check if user is the owner of the petition
    if (petition.userCode !== userCode) {
      throw new Error('Unauthorized: You can only delete your own petitions');
    }

    // Hard delete the petition
    await petitionRepository.remove(petition);
  }
}

