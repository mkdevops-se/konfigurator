import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentsController } from './environments/environments.controller';
import { EnvironmentsService } from './environments/environments.service';

@Module({
  imports: [],
  controllers: [AppController, EnvironmentsController],
  providers: [AppService, EnvironmentsService],
})
export class AppModule {}
