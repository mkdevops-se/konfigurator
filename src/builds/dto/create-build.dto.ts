import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBuildDto {
  @IsString()
  @IsNotEmpty()
  image_tag: string;

  @IsString()
  @IsNotEmpty()
  build_timestamp: string;

  @IsString()
  @IsNotEmpty()
  commit_link: string;

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
