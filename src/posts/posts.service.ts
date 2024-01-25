import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';


/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */
@Injectable()
export class PostsService {
    constructor(
      @InjectRepository(PostsModel)
      private readonly postsRepository: Repository<PostsModel>,
    ) {}

    async getAllPosts() {
      return this.postsRepository.find({
        relations: ['author'],
      });
    }

    async getPostById(id: number){
      const post = await this.postsRepository.findOne({
        where: {
          id,
        },
        relations: ['author'],
      });

      if(!post){
        throw new NotFoundException();
      }

      return post;
    }

    async createPost(authorId: number, title: string, content: string) {
      // 1) create -> 저장할 객체를 생성한다.
      // 2) save -> 저장할 객체를 저장한다. (create 메서드에서 생성한 객체로)

      const post = this.postsRepository.create({
        author:{
          id: authorId,
        },
        title,
        content,
        likeCount: 0,
        commentCount: 0,
      });

      const newPost = await this.postsRepository.save(post);

      return newPost;
    }

    async updatePost(postId: number, title: string, content: string){
      // save의 기능
      // 1) 데이터가 존재하지 않는다면 (id기준으로) 새로 생성한다.
      // 2) 데이터가 존재한다면 (id값이 존재한다면) 기존 데이터를 수정한다.

      const post = await this.postsRepository.findOne({
        where: {
          id: postId,
        },
      });

      if(!post){
        throw new NotFoundException();
      }

      if(title){
        post.title = title;
      }

      if(content){
        post.content = content;
      }

      const newPost = await this.postsRepository.save(post);

      return newPost;
    }

    async deletePost(postId: number){
      const post = await this.postsRepository.findOne({
        where: {
          id: postId,
        },
      });

      if(!post){
        throw new NotFoundException();
      }
      
      await this.postsRepository.delete(postId);

      return postId;
    }
}
