import { AppDataSource } from '../../../data-source';
import { Petition } from '../models/petition.entity';

export interface PaginatedPetitionsResponse {
  petitions: PetitionWithApprovalCount[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PetitionWithApprovalCount {
  code: string;
  userCode: string;
  userName: string;
  userImage: string | null;
  name: string;
  description: string;
  address: string | null;
  createdAt: Date;
  approvalCount: number;
}

export class GetPaginatedPetitionsService {
  async run(page: number, limit: number): Promise<PaginatedPetitionsResponse> {
    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    
    const petitionRepository = AppDataSource.getRepository(Petition);
    
    // Calculate offset
    const skip = (validPage - 1) * validLimit;
    
    // Get petitions with approval counts using query builder
    const petitions = await petitionRepository
      .createQueryBuilder('petition')
      .leftJoin('users', 'user', 'user.code = petition.userCode')
      .leftJoin('petition_approvals', 'approval', 'approval.petition_id = petition.id')
      .select([
        'petition.code',
        'petition.userCode',
        'user.name as userName',
        'user.image as userImage',
        'petition.name',
        'petition.description',
        'petition.address',
        'petition.createdAt',
        'COUNT(approval.id) as approvalCount'
      ])
      .groupBy('petition.id')
      .addGroupBy('petition.code')
      .addGroupBy('petition.userCode')
      .addGroupBy('userName')
      .addGroupBy('userImage')
      .addGroupBy('petition.name')
      .addGroupBy('petition.description')
      .addGroupBy('petition.address')
      .addGroupBy('petition.createdAt')
      .orderBy('petition.createdAt', 'DESC')
      .limit(validLimit)
      .offset(skip)
      .getRawMany();
    
    // Get total count for pagination metadata
    const totalItems = await petitionRepository.count();
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPreviousPage = validPage > 1;
    
    // Format the response
    const formattedPetitions: PetitionWithApprovalCount[] = petitions.map((petition) => ({
      code: petition.petition_code,
      userCode: petition.petition_userCode,
      userName: petition.userName,
      userImage: petition.userImage,
      name: petition.petition_name,
      description: petition.petition_description,
      address: petition.petition_address,
      approvalCount: parseInt(petition.approvalCount) || 0,
      createdAt: petition.petition_createdAt,
    }));
    
    return {
      petitions: formattedPetitions,
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

