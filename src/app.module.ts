import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Environment } from './environments/environment.entity';
import { EnvironmentsModule } from './environments/environments.module';
import { HeartbeatsService } from './heartbeats/heartbeats.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''
      }`,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_URL,
      dropSchema: process.env.DATABASE_DROP_SCHEMA === 'true',
      entities: [Environment],
      keepConnectionAlive: true,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    EnvironmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HeartbeatsService],
})
export class AppModule {}
