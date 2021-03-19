import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UserRepository } from './entities/user.repository';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
      providers: [UsersService, UserRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
