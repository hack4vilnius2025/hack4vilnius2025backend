import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Generated, Index } from 'typeorm';
import { User } from '../../auth/models/user.entity';

@Entity('petitions')
export class Petition {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @Generated('uuid')
  @Index()
  code: string;

  @Column({ length: 36, name: 'user_code' })
  @Index()
  userCode: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

