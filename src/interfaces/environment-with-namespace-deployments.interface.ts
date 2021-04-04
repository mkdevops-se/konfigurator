import { EnvironmentInterface } from './environment.interface';
import { NamespaceDeploymentsInterface } from './namespace-deployments.interface';

export interface EnvironmentWithNamespaceDeploymentsI
  extends EnvironmentInterface {
  ocp_namespaces: NamespaceDeploymentsInterface[];
}
