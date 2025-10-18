import { AppDataSource } from '../../../data-source';
import { Petition } from '../models/petition.entity';

export interface UpdatePetitionInput {
  name?: string;
  description?: string;
  address?: string;
}

export class UpdatePetitionService {
  async run(petitionCode: string, userCode: string, input: UpdatePetitionInput): Promise<Petition> {
    const petitionRepository = AppDataSource.getRepository(Petition);

    // Find petition by code
    const petition = await petitionRepository.findOne({
      where: { code: petitionCode },
    });

    if (!petition) {
      throw new Error('Petition not found');
    }

    // Check if the user is the creator of the petition
    if (petition.userCode !== userCode) {
      throw new Error('Only the creator can update this petition');
    }

    // Update only provided fields
    if (input.name !== undefined) {
      petition.name = input.name;
    }
    if (input.description !== undefined) {
      petition.description = input.description;
    }
    if (input.address !== undefined) {
      petition.address = input.address;
    }

    // Save updated petition
    await petitionRepository.save(petition);

    return petition;
  }
}

