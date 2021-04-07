import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialBaseline1617531253911 implements MigrationInterface {
  name = 'InitialBaseline1617531253911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "build"
       (
         "image_name"             varying character NOT NULL,
         "image_tag"              varying character NOT NULL,
         "build_timestamp"        varying character NOT NULL,
         "commit_link"            varying character NOT NULL,
         "build_type"             varchar,
         "spring_profiles_active" varying character,
         "artifactory_path"       varying character,
         "jenkins_host"           varying character,
         "operator_id"            varying character,
         "created_at"             datetime          NOT NULL DEFAULT (datetime('now')),
         "updated_at"             datetime          NOT NULL DEFAULT (datetime('now')),
         PRIMARY KEY ("image_name", "image_tag")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "deployment"
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
      `CREATE TABLE IF NOT EXISTS "environment"
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
         "created_at"               datetime                      NOT NULL DEFAULT (datetime('now')),
         "updated_at"               datetime                      NOT NULL DEFAULT (datetime('now'))
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "task"
       (
         "id"         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
         "action"     varchar                           NOT NULL,
         "state"      varchar                           NOT NULL DEFAULT ('pending'),
         "data"       text                              NOT NULL,
         "created_at" datetime                          NOT NULL DEFAULT (datetime('now')),
         "updated_at" datetime                          NOT NULL DEFAULT (datetime('now'))
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user"
       (
         "user_id"                  varying character PRIMARY KEY NOT NULL,
         "id"                       varying character,
         "provider"                 varying character,
         "display_name"             varying character,
         "nickname"                 varying character,
         "family_name"              varying character,
         "given_name"               varying character,
         "email"                    varying character,
         "identities"               text array,
         "groups"                   text array,
         "picture_url"              varying character,
         "locale"                   varying character,
         "konfigurator_login_count" integer                       NOT NULL DEFAULT (0),
         "konfigurator_super_admin" boolean                       NOT NULL DEFAULT (0),
         "created_at"               datetime                      NOT NULL DEFAULT (datetime('now')),
         "updated_at"               datetime                      NOT NULL DEFAULT (datetime('now'))
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "environment"`);
    await queryRunner.query(`DROP TABLE "deployment"`);
    await queryRunner.query(`DROP TABLE "build"`);
  }
}
