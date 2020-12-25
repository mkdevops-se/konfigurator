import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from './dto';

@Controller('environments')
export class EnvironmentsController {
  @Post()
  create(@Body() createEnvironmentDto: CreateEnvironmentDto): string {
    console.log(
      `Creating environment ${
        createEnvironmentDto.name
      } with body ${JSON.stringify(createEnvironmentDto)}`,
    );
    return 'environment added';
  }

  @Get(':id')
  get(@Param('id') id: string): string {
    console.log(`Getting environment ${id}`);
    return `here are the environment with ID ${id}`;
  }

  @Get()
  getAll(): string {
    return 'here are all environments';
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ): string {
    console.log(
      `Updating environment ${id} with body ${JSON.stringify(
        updateEnvironmentDto,
      )}`,
    );
    return `here is the updated environment with ID ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    console.log(`Deleting environment ${id}`);
    return `environment with ID ${id} deleted`;
  }
}
