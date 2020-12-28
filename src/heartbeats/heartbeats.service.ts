import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HeartbeatsService {
  private readonly logger = new Logger(HeartbeatsService.name);

  @Cron('56 * * * * *')
  handleCron() {
    this.logger.debug('Still beating, at 56');
  }
}
