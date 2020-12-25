import { Injectable } from '@nestjs/common';
import { Environment } from '../interfaces/environment.interface';

@Injectable()
export class EnvironmentsService {
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
