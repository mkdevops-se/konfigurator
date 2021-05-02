export interface DeploymentInterface {
  environment: string;
  ocp_namespace: string;
  name: string;
  is_gateway: boolean;
  error_logs_redirect_url?: string;
  external_url?: string;
  memory_min?: string;
  memory_max?: string;
  cpu_min?: string;
  cpu_max?: string;
  replicas_target?: number;
  replicas_current?: number;
  build_info_api_path?: string;
  spring_profiles_active?: string;
  image_tag?: string;
  build_timestamp?: string;
  updated_at?: Date;
  update_timestamp?: string;
}
