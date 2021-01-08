import { Deployment } from './deployment.interface';

export interface NamespaceDeployments {
  ocp_namespace: string;
  ocp_console_url: string;
  deployments: Deployment[];
  deployments_that_have_external_urls: Deployment[];
}
