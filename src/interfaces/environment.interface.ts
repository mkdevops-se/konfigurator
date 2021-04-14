export interface EnvironmentInterface {
  name: string;
  rank: number;
  is_hidden: boolean;
  ocp_tenant_domain: string;
  ocp_namespace_front: string;
  ocp_namespace_backend: string;
  ocp_namespace_restricted: string;
  ocp_namespace_public: string;
  log_archive_index_front?: string;
  log_archive_index_backend?: string;
  log_archive_index_restricted?: string;
  log_archive_index_public?: string;
  mq_url?: string;
  mq_namespace?: string;
  db_url?: string;
  default_spring_profiles?: string;
  login_url?: string;
  login_urls?: string[];
  gateway_url?: string;
  comment?: string;
  comment_origin?: string;
}
