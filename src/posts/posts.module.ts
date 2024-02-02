import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    TypeOrmModule.forFeature([
      PostsModel,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService],
})
export class PostsModule {}
