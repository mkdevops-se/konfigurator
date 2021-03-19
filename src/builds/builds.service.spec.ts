import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { BuildsModule } from './builds.module';
import { BuildsService } from './builds.service';
import { BuildRepository } from './entities/build.repository';

describe('BuildsService', () => {
  let service: BuildsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BuildsModule],
      providers: [BuildsService, BuildRepository],
    }).compile();

    service = module.get<BuildsService>(BuildsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
