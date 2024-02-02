import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostsModel extends BaseModel{
    // User와 Posts의 관계는 1:N 관계이다.
    // null이 될 수 없다
    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,
    })
    author: UsersModel;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;
}