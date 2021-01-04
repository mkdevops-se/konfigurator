import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildsService } from './builds.service';
import { BuildsController } from './builds.controller';
import { BuildRepository } from './entities/build.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BuildRepository])],
  controllers: [BuildsController],
  providers: [BuildsService],
})
export class BuildsModule {}
