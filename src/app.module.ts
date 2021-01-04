import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeploymentsModule } from './deployments/deployments.module';
import { Deployment } from './deployments/entities/deployment.entity';
import { EnvironmentsModule } from './environments/environments.module';
import { Environment } from './environments/entities/environment.entity';
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
      type: 'sqljs',
      location: process.env.DATABASE_URL,
      autoSave: true,
      dropSchema: process.env.DATABASE_DROP_SCHEMA === 'true',
      entities: [Deployment, Environment],
      keepConnectionAlive: true,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    DeploymentsModule,
    EnvironmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HeartbeatsService],
})
export class AppModule {}
