import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';

// Test.createTestingModule() 메서드를 사용하여 PostsService를 테스트하는 모듈을 생성
describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
