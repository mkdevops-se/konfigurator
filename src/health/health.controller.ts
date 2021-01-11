import { Controller, Get } from '@nestjs/common';
import {
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private typeorm: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.dns.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.typeorm.pingCheck('database'),
    ]);
  }
}
