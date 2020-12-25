import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentsController } from './environments/environments.controller';

@Module({
  imports: [],
  controllers: [AppController, EnvironmentsController],
  providers: [AppService],
})
export class AppModule {}
