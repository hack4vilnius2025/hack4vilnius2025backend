import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('forums')
export class Forum {
    @PrimaryGeneratedColumn()
    id: number;

    @Generated('uuid')
    uuid: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @UpdateDateColumn({ name: 'updated_at '})
    updatedAt: Date;

    @Column({ name: 'creator_user_id' })
    creatorUserId: number;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'body' })
    body: string;

    @Column({ name: 'image_url', array: true })
    imageUrls: string[];
}
