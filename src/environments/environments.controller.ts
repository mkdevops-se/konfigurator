import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';
import { Environment } from '../interfaces/environment.interface';

@Controller('environments')
export class EnvironmentsController {
  constructor(private environmentsService: EnvironmentsService) {}

  @Post()
  async create(
    @Body() createEnvDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Creating environment '${createEnvDto.name}' with body ${JSON.stringify(
        createEnvDto,
      )}`,
    );
    const newEnv = await this.environmentsService.create(createEnvDto);
    return newEnv;
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Environment> {
    console.log(`Getting environment ${id} ...`);
    const oneEnv = await this.environmentsService.getOne(id);
    return oneEnv;
  }

  @Get()
  async getAll(): Promise<Environment[]> {
    const allEnvs = await this.environmentsService.getAll();
    console.log(`Getting all ${allEnvs.length} environments`);
    return allEnvs;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnvDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Updating environment ${id} with body ${JSON.stringify(updateEnvDto)}`,
    );
    const updatedEnv = await this.environmentsService.update(id, updateEnvDto);
    return updatedEnv;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Environment> {
    console.log(`Deleting environment ${id}`);
    const deletedEnv = await this.environmentsService.delete(id);
    return deletedEnv;
  }
}
