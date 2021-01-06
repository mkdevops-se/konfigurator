import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildsModule } from './builds/builds.module';
import { Build } from './builds/entities/build.entity';
import { DeploymentsModule } from './deployments/deployments.module';
import { Deployment } from './deployments/entities/deployment.entity';
import { EnvironmentsModule } from './environments/environments.module';
import { Environment } from './environments/entities/environment.entity';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { MockBuildInfoModule } from './mock-build-info/mock-build-info.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';

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
      entities: [Build, Deployment, Environment, Task],
      keepConnectionAlive: true,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    BuildsModule,
    DeploymentsModule,
    EnvironmentsModule,
    MockBuildInfoModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, HeartbeatsService],
})
export class AppModule {}
