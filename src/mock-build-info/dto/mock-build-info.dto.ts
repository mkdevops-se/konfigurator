import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MockBuildInfoDto {
  @IsString()
  @IsNotEmpty()
  IMAGE_TAG: string;

  @IsString()
  @IsNotEmpty()
  BUILD_TIMESTAMP: string;

  @IsString()
  @IsNotEmpty()
  COMMIT_LINK: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  BUILD_TYPE?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  SPRING_PROFILES_ACTIVE?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ARTIFACTORY_PATH?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  JENKINS_HOST?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  OPERATOR_ID?: string;
}
