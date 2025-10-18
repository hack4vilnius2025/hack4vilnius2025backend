import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../auth/models/user.entity";

@Entity('forums')
export class Forum {
    @PrimaryGeneratedColumn()
    id: number;

    @Generated('uuid')
    code: string;

    @Column({ type: 'uuid', name: 'user_code' })
    @Index()
    userCode: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'body' })
    body: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
