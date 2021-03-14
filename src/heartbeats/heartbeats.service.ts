import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HeartbeatsService {
  private readonly logger = new Logger(HeartbeatsService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly authService: AuthService,
  ) {
    const heartbeatJob = new CronJob('56 * * * * *', () => this.heartbeat());
    this.schedulerRegistry.addCronJob('heartbeat', heartbeatJob);
    if (process.env.NODE_ENV !== 'test') {
      heartbeatJob.start();
      this.authService.saveLocalAccessToken();
    }
  }

  heartbeat() {
    this.logger.debug('Still beating, at 56');
    this.authService.saveLocalAccessToken();
  }
}
