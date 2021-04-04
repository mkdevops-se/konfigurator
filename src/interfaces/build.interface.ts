export interface BuildInterface {
  image_name: string;
  image_tag: string;
  build_timestamp: string;
  commit_link: string;
  commit_sha?: string;
  build_type?: string;
  spring_profiles_active?: string;
  artifactory_path?: string;
  artifactory_link?: string;
  jenkins_host?: string;
  operator_id?: string;
}
