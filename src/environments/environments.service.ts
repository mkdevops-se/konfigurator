import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Environment } from './environment.entity';

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment)
    private environmentsRepository: Repository<Environment>,
  ) {}

  private readonly environments: Environment[] = [];

  create(environment: Environment) {
    this.environments.push(environment);
  }

  getAll(): Environment[] {
    if (this.environments.keys()) {
      return this.environments;
    } else {
      return [];
    }
  }
}
