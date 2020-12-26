import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsService } from './environments.service';
import { Environment } from './environment.entity';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({ entities: [Environment] })],
      providers: [EnvironmentsService],
    }).compile();

    service = module.get<EnvironmentsService>(EnvironmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
