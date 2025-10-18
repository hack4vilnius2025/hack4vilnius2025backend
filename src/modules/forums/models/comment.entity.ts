import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Generated, Index } from 'typeorm';
import { User } from '../../auth/models/user.entity';
import { Forum } from './forum.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  @Index()
  code: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  forumId: string;

  @ManyToOne(() => Forum)
  @JoinColumn({ name: 'forum_id' })
  forum: Forum;

  @Column('text')
  commentText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

