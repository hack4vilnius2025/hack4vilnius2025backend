import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../auth/models/user.entity';
import { Petition } from './petition.entity';

@Entity('petition_approvals')
@Index(['userCode', 'petition'], { unique: true })
export class PetitionApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36, name: 'user_code' })
  userCode: string;

  @ManyToOne(() => Petition)
  @JoinColumn({ name: 'petition_id' })
  petition: Petition;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

