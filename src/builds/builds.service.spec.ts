import { Test, TestingModule } from '@nestjs/testing';
import { BuildsService } from './builds.service';

describe('BuildsService', () => {
  let service: BuildsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildsService],
    }).compile();

    service = module.get<BuildsService>(BuildsService);
  });

  xit('should be defined', () => {
    expect(service).toBeDefined();
  });
});
