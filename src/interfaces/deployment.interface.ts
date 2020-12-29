export interface Deployment {
  environment: string;
  ocp_namespace: string;
  name: string;
  memory_min?: string;
  memory_max?: string;
  cpu_min?: string;
  cpu_max?: string;
  replicas_target?: number;
  replicas_current?: number;
}
