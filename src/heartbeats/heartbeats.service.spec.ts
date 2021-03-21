import { Test, TestingModule } from '@nestjs/testing';
import { HeartbeatsService } from './heartbeats.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppModule } from '../app.module';
import { AuthModule } from '../auth/auth.module';

describe('HeartbeatsService', () => {
  let service: HeartbeatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
      providers: [SchedulerRegistry, HeartbeatsService],
    }).compile();

    service = module.get<HeartbeatsService>(HeartbeatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
