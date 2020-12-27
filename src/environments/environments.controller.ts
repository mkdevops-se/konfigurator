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
  get(@Param('id') id: string): string {
    console.log(`Getting environment ${id}`);
    return `here are the environment with ID ${id}`;
  }

  @Get()
  async getAll(): Promise<Environment[]> {
    return this.environmentsService.getAll();
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
  remove(@Param('id') id: string): string {
    console.log(`Deleting environment ${id}`);
    return `environment with ID ${id} deleted`;
  }
}
