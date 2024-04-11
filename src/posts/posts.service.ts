import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


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

    // 1) GET /posts
    async getAllPosts() {
      return this.postsRepository.find({
        relations: ['author'],
      });
    }

    // 2) GET /posts/:id
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

    // 3) POST /posts
    async createPost(authorId: number, postDto: CreatePostDto) {
      // 1) create -> 저장할 객체를 생성한다.
      // 2) save -> 저장할 객체를 저장한다. (create 메서드에서 생성한 객체로)

      const post = this.postsRepository.create({
        author:{
          id: authorId,
        },
        ...postDto,
        likeCount: 0,
        commentCount: 0,
      });

      const newPost = await this.postsRepository.save(post);

      return newPost;
    }

    // 4) PUT /posts/:id
    async updatePost(postId: number, postDto: UpdatePostDto){
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

      if(postDto.title){
        post.title = postDto.title;
      }

      if(postDto.content){
        post.content = postDto.content;
      }

      const newPost = await this.postsRepository.save(post);

      return newPost;
    }

    // 5) DELETE /posts/:id
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
