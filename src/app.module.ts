import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildsModule } from './builds/builds.module';
import { Build } from './builds/entities/build.entity';
import { DeploymentsModule } from './deployments/deployments.module';
import { Deployment } from './deployments/entities/deployment.entity';
import { EnvironmentsModule } from './environments/environments.module';
import { Environment } from './environments/entities/environment.entity';
import { HealthController } from './health/health.controller';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { MockBuildInfoModule } from './mock-build-info/mock-build-info.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        WEB_SERVER_PORT: Joi.number().default('3000'),
        WEB_SERVER_HOST: Joi.string().hostname().default('localhost'),
        DATABASE_URL: Joi.string().uri({ allowRelative: true }).required(),
        DATABASE_DROP_SCHEMA: Joi.alternatives('true', 'false').default(
          'false',
        ),
        DATABASE_SYNCHRONIZE: Joi.alternatives('true', 'false').default('true'),
        OAUTH2_ISSUER: Joi.string().uri().required(),
        OAUTH2_AUDIENCE: Joi.string()
          .regex(/[a-z\-\/.]+/)
          .required(),
        OAUTH2_AUTH0_TENANT_DOMAIN: Joi.string().hostname().required(),
        OAUTH2_AUTH0_CLIENT_ID: Joi.string().token().required(),
        OAUTH2_AUTH0_CLIENT_SECRET: Joi.string()
          .regex(/[a-zA-Z\-]+/)
          .required(),
        OAUTH2_AUTH0_CALLBACK_URL: Joi.string().uri().required(),
        OAUTH2_SIGNING_SECRET: Joi.string().token().required(),
        OAUTH2_SIGNING_ALGORITHM: Joi.string().valid('HS256').default('HS256'),
        OAUTH2_LOCAL_ACCESS_TOKEN: Joi.string()
          .uri({ allowRelative: true })
          .required(),
        SESSION_SECRET: Joi.string().token(),
      }),
      envFilePath: `.env.${process.env.NODE_ENV}`,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: process.env.DATABASE_URL,
      autoSave: true,
      dropSchema: process.env.DATABASE_DROP_SCHEMA === 'true',
      entities: [Build, Deployment, Environment, Task, User],
      keepConnectionAlive: true,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    BuildsModule,
    DeploymentsModule,
    EnvironmentsModule,
    MockBuildInfoModule,
    TasksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    HeartbeatsService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
