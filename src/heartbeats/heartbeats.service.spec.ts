import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HeartbeatsService } from './heartbeats.service';
import { AuthService } from '../auth/auth.service';

describe('HeartbeatsService', () => {
  let service: HeartbeatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, SchedulerRegistry, HeartbeatsService],
    }).compile();

    service = module.get<HeartbeatsService>(HeartbeatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
