import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Environment } from './environments/environment.entity';
import { EnvironmentsModule } from './environments/environments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''
      }`,
      expandVariables: true,
    }),
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
  providers: [AppService],
})
export class AppModule {}
