import { Environment } from './environment.interface';
import { NamespaceDeployments } from './namespace-deployments.interface';

export interface EnvironmentWithNamespaceDeployments extends Environment {
  ocp_namespaces: NamespaceDeployments[];
}
