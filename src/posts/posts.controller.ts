import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';


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
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  // 새로운 포스트를 생성한다.
  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @User('id') userId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ){
    return this.postsService.createPost(userId, title, content);
  }

  // 4) PUT /posts/:id
  // id에 해당하는 포스트를 수정한다.
  @Put(':id')
  putPost(
    @Param('id',ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  // 5) DELETE /posts/:id
  // id에 해당하는 포스트를 삭제한다.
  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
  ){
    return this.postsService.deletePost(id);
  }

}
