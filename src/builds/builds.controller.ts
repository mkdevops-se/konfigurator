import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseFilters,
  Logger,
  Render,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '../validation.pipe';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';
import { Build } from './entities/build.entity';
import { Public } from '../auth/jwt-auth.guard';

@Controller('builds')
@UseFilters(HttpExceptionFilter)
export class BuildsController {
  private readonly logger = new Logger(BuildsController.name);

  constructor(private readonly buildsService: BuildsService) {}

  @Post(':image_name')
  async create(
    @Param('image_name') image_name: string,
    @Body(new ValidationPipe()) createBuildDto: CreateBuildDto,
  ): Promise<Build> {
    this.logger.log(
      `Creating build for '${image_name}' with ${JSON.stringify(
        createBuildDto,
      )} ...`,
    );
    const {
      updated_at,
      created_at,
      ...newBuild
    } = await this.buildsService.create(image_name, createBuildDto);
    this.logger.debug(`Created build: ${JSON.stringify(newBuild)}`);
    return newBuild;
  }

  @Public()
  @Get()
  @Render('builds/builds')
  async findAll() {
    this.logger.log(`Getting all builds ...`);
    const allBuilds = await this.buildsService.getAll();
    this.logger.debug(`Got all builds: ${JSON.stringify(allBuilds)}`);
    return {
      title: 'builds',
      message: `Nedan listas alla byggen som Konfigurator-tjänsten identifierat.`,
      SERVER_STARTUP_TIMESTAMP: process.env.SERVER_STARTUP_TIMESTAMP,
      IMAGE_TAG: process.env.IMAGE_TAG,
      COMMIT_LINK: process.env.COMMIT_LINK,
      BUILD_TIMESTAMP: process.env.BUILD_TIMESTAMP,
      builds: allBuilds,
    };
  }

  @Public()
  @Get(':image_name')
  async findAllFor(@Param('image_name') image_name: string): Promise<Build[]> {
    this.logger.log(`Getting all builds for ${image_name} ...`);
    const allBuildsForImage = await this.buildsService.getAllFor(image_name);
    this.logger.debug(
      `Got all builds for ${image_name}: ${JSON.stringify(allBuildsForImage)}`,
    );
    return allBuildsForImage;
  }

  @Public()
  @Get(':image_name/:image_tag')
  async findOne(
    @Param('image_name') image_name: string,
    @Param('image_tag') image_tag: string,
  ): Promise<Build> {
    this.logger.log(`Getting build ${image_name}-${image_tag} ...`);
    const oneBuild = await this.buildsService.getOne(image_name, image_tag);
    this.logger.debug(`Got one build: ${JSON.stringify(oneBuild)}`);
    return oneBuild;
  }

  @Put(':image_name/:image_tag')
  async update(
    @Param('image_name') image_name: string,
    @Param('image_tag') image_tag: string,
    @Body(new ValidationPipe()) updateBuildDto: UpdateBuildDto,
  ): Promise<Build> {
    this.logger.log(
      `Updating build ${image_name}-${image_tag} with ${JSON.stringify(
        updateBuildDto,
      )} ...`,
    );
    const { updated_at, ...updatedBuild } = await this.buildsService.update(
      image_name,
      image_tag,
      updateBuildDto,
    );
    this.logger.debug(`Updated build: ${JSON.stringify(updatedBuild)}`);
    return updatedBuild;
  }

  @Delete(':image_name/:image_tag')
  remove(
    @Param('image_name') image_name: string,
    @Param('image_tag') image_tag: string,
  ): Promise<Build> {
    return this.buildsService.delete(image_name, image_tag);
  }
}
