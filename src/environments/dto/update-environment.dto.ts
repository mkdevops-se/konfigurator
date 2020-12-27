import { IsString, IsOptional } from 'class-validator';

export class UpdateEnvironmentDto {
  @IsString()
  @IsOptional()
  ocp_tenant_domain?: string;

  @IsString()
  @IsOptional()
  ocp_namespace_front?: string;

  @IsString()
  @IsOptional()
  ocp_namespace_backend?: string;

  @IsString()
  @IsOptional()
  ocp_namespace_restricted?: string;

  @IsString()
  @IsOptional()
  ocp_namespace_public?: string;

  @IsString()
  @IsOptional()
  mq_url?: string;

  @IsString()
  @IsOptional()
  mq_namespace?: string;

  @IsString()
  @IsOptional()
  db_url?: string;

  @IsString()
  @IsOptional()
  default_spring_profiles?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
