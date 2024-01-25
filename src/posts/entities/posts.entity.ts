import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostsModel {
    @PrimaryGeneratedColumn()
    id: number;

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