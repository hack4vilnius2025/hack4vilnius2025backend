import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Generated, Index } from 'typeorm';
import { Forum } from './forum.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  @Index()
  code: string;

  @Column({ type: 'uuid', name: 'user_code' })
  @Index()
  userCode: string;

  @ManyToOne(() => Forum)
  @JoinColumn({ name: 'forum_id' })
  forum: Forum;  

  @Column('text', { name: 'comment_text' })
  commentText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

