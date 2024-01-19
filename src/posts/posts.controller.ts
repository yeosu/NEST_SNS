import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts : PostModel[] = [
  {
    id: 1,
    author: 'John',
    title: 'My first post',
    content: 'Lorem ipsum dolor sit amet',
    likeCount: 10,
    commentCount: 2,
  },
  {
    id: 2,
    author: 'Jane',
    title: 'My second post',
    content: 'Lorem ipsum dolor sit amet',
    likeCount: 12,
    commentCount: 0,
  },
  {
    id: 3,
    author: 'IU',
    title: 'My third post',
    content: 'Lorem ipsum dolor sit amet',
    likeCount: 2,
    commentCount: 2,
  }
]

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 포스트를 다 가져온다.
  @Get()
  getPosts() {
    return posts;
  }

  // 2) GET /posts/:id
  // id에 해당하는 포스트를 가져온다.
  @Get(':id')
  getPost(@Param('id') id: string) {
    const post = posts.find(post => post.id === +id);

    if(!post){
      throw new NotFoundException();
    }

    return post;
  }

  // 3) POST /posts
  // 새로운 포스트를 생성한다.
  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ){
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts = [
      ...posts,
      post,
    ];
  }

  // 4) PUT /posts/:id
  // id에 해당하는 포스트를 수정한다.
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const post = posts.find(post => post.id === +id);

    if(!post){
      throw new NotFoundException();
    }

    if(author){
      post.author = author;
    }

    if(title){
      post.title = title;
    }

    if(content){
      post.content = content;
    }

    posts = posts.map(prevPost => prevPost.id === +id ? post : prevPost);

    return post;
  }

  // 5) DELETE /posts/:id
  // id에 해당하는 포스트를 삭제한다.
  @Delete(':id')
  deletePost(
    @Param('id') id: string,
  ){
    const post = posts.find(post => post.id === +id);

    if(!post){
      throw new NotFoundException();
    }
    
    posts = posts.filter(post => post.id !== +id);

    return id;
  }

}
