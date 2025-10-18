import { AppDataSource } from '../../../data-source';
import { Petition } from '../models/petition.entity';

export interface CreatePetitionInput {
  name: string;
  description: string;
  address?: string;
}

export class CreatePetitionService {
  async run(userCode: string, input: CreatePetitionInput): Promise<Petition> {
    const petitionRepository = AppDataSource.getRepository(Petition);

    // Create new petition
    const petition = petitionRepository.create({
      userCode,
      name: input.name,
      description: input.description,
      address: input.address,
    });

    // Save petition to database
    await petitionRepository.save(petition);

    return petition;
  }
}

