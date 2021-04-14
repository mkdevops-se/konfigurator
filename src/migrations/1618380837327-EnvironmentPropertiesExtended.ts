import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnvironmentPropertiesExtended1618380837327
  implements MigrationInterface {
  name = 'EnvironmentPropertiesExtended1618380837327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_deployment"
       (
         "environment"            varying character NOT NULL,
         "ocp_namespace"          varying character NOT NULL,
         "name"                   varying character NOT NULL,
         "is_gateway"             boolean           NOT NULL DEFAULT (0),
         "memory_min"             varying character,
         "memory_max"             varying character,
         "cpu_min"                varying character,
         "cpu_max"                varying character,
         "replicas_target"        integer,
         "replicas_current"       integer,
         "build_info_api_path"    varying character NOT NULL DEFAULT ('/bygginfo'),
         "spring_profiles_active" varying character,
         "image_tag"              varying character,
         "build_timestamp"        varying character,
         "created_at"             datetime          NOT NULL DEFAULT (datetime('now')),
         "updated_at"             datetime          NOT NULL DEFAULT (datetime('now')),
         PRIMARY KEY ("environment", "name")
       )`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_deployment"("environment", "ocp_namespace", "name", "is_gateway", "memory_min",
                                          "memory_max", "cpu_min", "cpu_max", "replicas_target", "replicas_current",
                                          "spring_profiles_active", "image_tag", "build_timestamp", "created_at",
                                          "updated_at")
       SELECT "environment",
              "ocp_namespace",
              "name",
              "is_gateway",
              "memory_min",
              "memory_max",
              "cpu_min",
              "cpu_max",
              "replicas_target",
              "replicas_current",
              "spring_profiles_active",
              "image_tag",
              "build_timestamp",
              "created_at",
              "updated_at"
       FROM "deployment"`,
    );
    await queryRunner.query(`DROP TABLE "deployment"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_deployment"
        RENAME TO "deployment"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_environment"
       (
         "name"                         varying character PRIMARY KEY NOT NULL,
         "rank"                         integer                       NOT NULL DEFAULT (0),
         "is_hidden"                    boolean                       NOT NULL DEFAULT (0),
         "ocp_tenant_domain"            varying character             NOT NULL,
         "ocp_namespace_front"          varying character             NOT NULL,
         "ocp_namespace_backend"        varying character             NOT NULL,
         "ocp_namespace_restricted"     varying character             NOT NULL,
         "ocp_namespace_public"         varying character             NOT NULL,
         "log_archive_index_front"      varying character,
         "log_archive_index_backend"    varying character,
         "log_archive_index_restricted" varying character,
         "log_archive_index_public"     varying character,
         "mq_url"                       varying character,
         "mq_namespace"                 varying character,
         "db_url"                       varying character,
         "default_spring_profiles"      varying character,
         "login_url"                    varying character,
         "login_urls"                   text,
         "gateway_url"                  varying character,
         "comment"                      varying character,
         "comment_origin"               varying character,
         "created_at"                   datetime                      NOT NULL DEFAULT (datetime('now')),
         "updated_at"                   datetime                      NOT NULL DEFAULT (datetime('now'))
       )`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_environment"("name", "rank", "ocp_tenant_domain", "ocp_namespace_front",
                                           "ocp_namespace_backend", "ocp_namespace_restricted", "ocp_namespace_public",
                                           "mq_url", "mq_namespace", "db_url", "default_spring_profiles", "login_url",
                                           "gateway_url", "comment", "comment_origin", "created_at", "updated_at")
       SELECT "name",
              "rank",
              "ocp_tenant_domain",
              "ocp_namespace_front",
              "ocp_namespace_backend",
              "ocp_namespace_restricted",
              "ocp_namespace_public",
              "mq_url",
              "mq_namespace",
              "db_url",
              "default_spring_profiles",
              "login_url",
              "gateway_url",
              "comment",
              "comment_origin",
              "created_at",
              "updated_at"
       FROM "environment"`,
    );
    await queryRunner.query(`DROP TABLE "environment"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_environment"
        RENAME TO "environment"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "environment"
        RENAME TO "temporary_environment"`,
    );
    await queryRunner.query(
      `CREATE TABLE "environment"
       (
         "name"                     varying character PRIMARY KEY NOT NULL,
         "rank"                     integer                       NOT NULL DEFAULT (0),
         "ocp_tenant_domain"        varying character             NOT NULL,
         "ocp_namespace_front"      varying character             NOT NULL,
         "ocp_namespace_backend"    varying character             NOT NULL,
         "ocp_namespace_restricted" varying character             NOT NULL,
         "ocp_namespace_public"     varying character,
         "mq_url"                   varying character,
         "mq_namespace"             varying character,
         "db_url"                   varying character,
         "default_spring_profiles"  varying character,
         "login_url"                varying character,
         "gateway_url"              varying character,
         "comment"                  varying character,
         "comment_origin"           varying character,
         "created_at"               datetime                      NOT NULL DEFAULT (datetime('now')),
         "updated_at"               datetime                      NOT NULL DEFAULT (datetime('now'))
       )`,
    );
    await queryRunner.query(
      `INSERT INTO "environment"("name", "rank", "ocp_tenant_domain", "ocp_namespace_front", "ocp_namespace_backend",
                                 "ocp_namespace_restricted", "ocp_namespace_public", "mq_url", "mq_namespace", "db_url",
                                 "default_spring_profiles", "login_url", "gateway_url", "comment", "comment_origin",
                                 "created_at", "updated_at")
       SELECT "name",
              "rank",
              "ocp_tenant_domain",
              "ocp_namespace_front",
              "ocp_namespace_backend",
              "ocp_namespace_restricted",
              "ocp_namespace_public",
              "mq_url",
              "mq_namespace",
              "db_url",
              "default_spring_profiles",
              "login_url",
              "gateway_url",
              "comment",
              "comment_origin",
              "created_at",
              "updated_at"
       FROM "temporary_environment"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_environment"`);
    await queryRunner.query(
      `ALTER TABLE "deployment"
        RENAME TO "temporary_deployment"`,
    );
    await queryRunner.query(
      `CREATE TABLE "deployment"
       (
         "environment"            varying character NOT NULL,
         "ocp_namespace"          varying character NOT NULL,
         "name"                   varying character NOT NULL,
         "is_gateway"             boolean           NOT NULL DEFAULT (0),
         "memory_min"             varying character,
         "memory_max"             varying character,
         "cpu_min"                varying character,
         "cpu_max"                varying character,
         "replicas_target"        integer,
         "replicas_current"       integer,
         "spring_profiles_active" varying character,
         "image_tag"              varying character,
         "build_timestamp"        varying character,
         "created_at"             datetime          NOT NULL DEFAULT (datetime('now')),
         "updated_at"             datetime          NOT NULL DEFAULT (datetime('now')),
         PRIMARY KEY ("environment", "name")
       )`,
    );
    await queryRunner.query(
      `INSERT INTO "deployment"("environment", "ocp_namespace", "name", "is_gateway", "memory_min", "memory_max",
                                "cpu_min", "cpu_max", "replicas_target", "replicas_current", "spring_profiles_active",
                                "image_tag", "build_timestamp", "created_at", "updated_at")
       SELECT "environment",
              "ocp_namespace",
              "name",
              "is_gateway",
              "memory_min",
              "memory_max",
              "cpu_min",
              "cpu_max",
              "replicas_target",
              "replicas_current",
              "spring_profiles_active",
              "image_tag",
              "build_timestamp",
              "created_at",
              "updated_at"
       FROM "temporary_deployment"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_deployment"`);
  }
}
