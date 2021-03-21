import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseFilters,
  Logger,
  Post,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '../validation.pipe';
import { MockBuildInfoDto } from './dto/mock-build-info.dto';
import { MockBuildInfoService } from './mock-build-info.service';
import { Public } from '../auth/jwt-auth.guard';

@Controller('mock-api')
@UseFilters(HttpExceptionFilter)
export class MockBuildInfoController {
  private readonly logger = new Logger(MockBuildInfoController.name);

  constructor(private readonly mockBuildInfoService: MockBuildInfoService) {}

  @Post(':service/bygginfo')
  create(
    @Param('service') service: string,
    @Body(new ValidationPipe()) mockBuildInfoDto: MockBuildInfoDto,
  ): MockBuildInfoDto {
    this.logger.log(
      `Add mock build info for ${service}: ${JSON.stringify(mockBuildInfoDto)}`,
    );
    return this.mockBuildInfoService.put(service, mockBuildInfoDto);
  }

  @Public()
  @Get(':service/bygginfo')
  get(@Param('service') service: string): MockBuildInfoDto {
    const mockBuildInfo = this.mockBuildInfoService.get(service);
    this.logger.log(
      `Got mock build info for ${service}: ${JSON.stringify(mockBuildInfo)}`,
    );
    return mockBuildInfo;
  }

  @Delete(':service/bygginfo')
  delete(@Param('service') service: string): MockBuildInfoDto {
    const mockBuildInfo = this.mockBuildInfoService.delete(service);
    this.logger.log(
      `Delete mock build info for ${service}: ${JSON.stringify(mockBuildInfo)}`,
    );
    return mockBuildInfo;
  }
}
