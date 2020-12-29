import { Deployment } from './deployment.interface';

export interface NamespaceDeployments {
  ocp_namespace: string;
  ocp_console_url: string;
  deployments: Deployment[];
}
