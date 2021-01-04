import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBuildDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  build_timestamp?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  commit_link?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  build_type?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  spring_profiles_active?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  artifactory_path?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  jenkins_host?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  operator_id?: string;
}
