import { DeploymentInterface } from './deployment.interface';

export interface NamespaceDeploymentsInterface {
  ocp_namespace: string;
  ocp_console_url: string;
  deployments: DeploymentInterface[];
  deployments_that_have_external_urls: DeploymentInterface[];
}
