import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsService } from './environments.service';
import { EnvironmentRepository } from './entities/environment.repository';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [EnvironmentRepository],
          keepConnectionAlive: true,
          synchronize: true,
        }),
      ],
      providers: [EnvironmentsService],
    }).compile();

    service = module.get<EnvironmentsService>(EnvironmentsService);
  });

  xit('should be defined', () => {
    expect(service).toBeDefined();
  });
});
