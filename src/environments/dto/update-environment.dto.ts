import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_tenant_domain?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_front?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_backend?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_restricted?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_public?: string;

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
  comment?: string;
}
