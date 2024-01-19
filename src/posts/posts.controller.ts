import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 포스트를 다 가져온다.
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  // id에 해당하는 포스트를 가져온다.
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  // 3) POST /posts
  // 새로운 포스트를 생성한다.
  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ){
    return this.postsService.createPost(author, title, content);
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
    return this.postsService.updatePost(+id, author, title, content);
  }

  // 5) DELETE /posts/:id
  // id에 해당하는 포스트를 삭제한다.
  @Delete(':id')
  deletePost(
    @Param('id') id: string,
  ){
    return this.postsService.deletePost(+id);
  }

}
