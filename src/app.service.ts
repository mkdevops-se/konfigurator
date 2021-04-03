import { partition } from 'lodash';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvironmentWithNamespaceDeploymentsI } from './interfaces/environment-with-namespace-deployments.interface';
import { EnvironmentsService } from './environments/environments.service';
import { DeploymentsService } from './deployments/deployments.service';

@Injectable()
export class AppService {
  constructor(
    private environmentsService: EnvironmentsService,
    private deploymentsService: DeploymentsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  private static getOcpConsoleUrl(tenant_domain: string, namespace: string) {
    return `https://master.${tenant_domain}:8443/console/project/${namespace}/browse/deployments`;
  }

  async getEnvironmentsOverview(): Promise<
    EnvironmentWithNamespaceDeploymentsI[]
  > {
    const plainEnvironments = await this.environmentsService.getAll();
    const processedEnvironments = <EnvironmentWithNamespaceDeploymentsI[]>[];
    for (const environment of plainEnvironments) {
      const processedEnvironment: EnvironmentWithNamespaceDeploymentsI = {
        ...environment,
        ocp_namespaces: [],
      };
      const deployments = await this.deploymentsService.getAllInEnvWithExternalUrls(
        environment,
      );

      const [front_deployments, non_front_deployments] = partition(
        deployments,
        (v) => v.ocp_namespace === environment.ocp_namespace_front,
      );
      if (front_deployments.length) {
        processedEnvironment.ocp_namespaces.push({
          ocp_namespace: environment.ocp_namespace_front,
          ocp_console_url: AppService.getOcpConsoleUrl(
            environment.ocp_tenant_domain,
            environment.ocp_namespace_front,
          ),
          deployments: front_deployments,
          deployments_that_have_external_urls: front_deployments.filter(
            (v) => v.external_url,
          ),
        });
      }

      const [backend_deployments, non_backend_deployments] = partition(
        non_front_deployments,
        (v) => v.ocp_namespace === environment.ocp_namespace_backend,
      );
      if (backend_deployments.length) {
        processedEnvironment.ocp_namespaces.push({
          ocp_namespace: environment.ocp_namespace_backend,
          ocp_console_url: AppService.getOcpConsoleUrl(
            environment.ocp_tenant_domain,
            environment.ocp_namespace_backend,
          ),
          deployments: backend_deployments,
          deployments_that_have_external_urls: backend_deployments.filter(
            (v) => v.external_url,
          ),
        });
      }

      const [restricted_deployments, non_restricted_deployments] = partition(
        non_backend_deployments,
        (v) => v.ocp_namespace === environment.ocp_namespace_restricted,
      );
      if (restricted_deployments.length) {
        processedEnvironment.ocp_namespaces.push({
          ocp_namespace: environment.ocp_namespace_restricted,
          ocp_console_url: AppService.getOcpConsoleUrl(
            environment.ocp_tenant_domain,
            environment.ocp_namespace_restricted,
          ),
          deployments: restricted_deployments,
          deployments_that_have_external_urls: restricted_deployments.filter(
            (v) => v.external_url,
          ),
        });
      }

      const [
        public_deployments,
        remaining_zero_non_public_deployments,
      ] = partition(
        non_restricted_deployments,
        (v) => v.ocp_namespace === environment.ocp_namespace_public,
      );
      if (public_deployments.length) {
        processedEnvironment.ocp_namespaces.push({
          ocp_namespace: environment.ocp_namespace_public,
          ocp_console_url: AppService.getOcpConsoleUrl(
            environment.ocp_tenant_domain,
            environment.ocp_namespace_public,
          ),
          deployments: public_deployments,
          deployments_that_have_external_urls: public_deployments.filter(
            (v) => v.external_url,
          ),
        });
      }

      if (!remaining_zero_non_public_deployments.length) {
        processedEnvironments.push(processedEnvironment);
      } else {
        throw new InternalServerErrorException(
          `Rogue deployments identified, ${JSON.stringify(
            remaining_zero_non_public_deployments,
          )}`,
        );
      }
    }
    return processedEnvironments;
  }
}
