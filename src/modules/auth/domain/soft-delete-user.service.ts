import { AppDataSource } from "../../../data-source";
import { User } from "../models/user.entity";

export class SoftDeleteUserService {
    async run(userCode: string): Promise<void> {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { code: userCode },
        });

        if (!user) throw new Error('User not found');
        
        await userRepository.softDelete(user.id);
    }
}
