import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class HeartbeatsService {
  private readonly logger = new Logger(HeartbeatsService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {
    const heartbeatJob = new CronJob('56 * * * * *', () => this.heartbeat());
    this.schedulerRegistry.addCronJob('heartbeat', heartbeatJob);
    if (process.env.NODE_ENV !== 'test') {
      heartbeatJob.start();
    }
  }

  heartbeat() {
    this.logger.debug('Still beating, at 56');
  }
}
