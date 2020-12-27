import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsService } from './environments.service';
import { Environment } from './environment.entity';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentRepository } from './environment.repository';
import { EnvironmentsModule } from './environments.module';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
