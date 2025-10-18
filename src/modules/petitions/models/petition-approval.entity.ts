import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/models/user.entity';
import { Petition } from './petition.entity';

@Entity('petition_approvals')
export class PetitionApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36, name: 'user_code' })
  userCode: string;

  @ManyToOne(() => Petition)
  @JoinColumn({ name: 'petition_id' })
  petition: Petition;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

