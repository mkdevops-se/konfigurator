import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  rank?: number;

  @IsBoolean()
  @IsOptional()
  is_hidden?: boolean;

  @IsString()
  @IsNotEmpty()
  ocp_tenant_domain: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_front: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_backend: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_restricted: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_public: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  log_archive_index_front?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  log_archive_index_backend?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  log_archive_index_restricted?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  log_archive_index_public?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mq_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mq_namespace?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  db_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  default_spring_profiles?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  login_url?: string;

  @IsArray()
  @IsOptional()
  login_urls?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  gateway_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;
}
