import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../auth/models/user.entity";

export enum ForumLanguage {
    EN = 'EN',
    LT = 'LT'
}

@Entity('forums')
export class Forum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 36 })
    @Generated('uuid')
    @Index()
    code: string;

    @Column({ length: 36, name: 'user_code' })
    @Index()
    userCode: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'body' })
    body: string;

    @Column({ name: 'address', nullable: true })
    address: string;

    @Column({ type: 'enum', enum: ForumLanguage, default: ForumLanguage.EN })
    language: ForumLanguage;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
