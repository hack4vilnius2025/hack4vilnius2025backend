import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Forum } from './forum.entity';

@Entity('forum_approvals')
export class ForumApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_code' })
  @Index()
  userCode: string;

  @ManyToOne(() => Forum)
  @JoinColumn({ name: 'forum_id' })
  forum: Forum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

