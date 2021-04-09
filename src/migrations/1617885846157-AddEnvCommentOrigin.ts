import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnvCommentOrigin1617885846157 implements MigrationInterface {
  name = 'AddEnvCommentOrigin1617885846157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_environment"
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
      `INSERT INTO "temporary_environment"("name", "rank", "ocp_tenant_domain", "ocp_namespace_front",
                                           "ocp_namespace_backend", "ocp_namespace_restricted", "ocp_namespace_public",
                                           "mq_url", "mq_namespace", "db_url", "default_spring_profiles", "login_url",
                                           "gateway_url", "comment", "created_at", "updated_at")
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
         "created_at"               datetime                      NOT NULL DEFAULT (datetime('now')),
         "updated_at"               datetime                      NOT NULL DEFAULT (datetime('now'))
       )`,
    );
    await queryRunner.query(
      `INSERT INTO "environment"("name", "rank", "ocp_tenant_domain", "ocp_namespace_front", "ocp_namespace_backend",
                                 "ocp_namespace_restricted", "ocp_namespace_public", "mq_url", "mq_namespace", "db_url",
                                 "default_spring_profiles", "login_url", "gateway_url", "comment", "created_at",
                                 "updated_at")
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
              "created_at",
              "updated_at"
       FROM "temporary_environment"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_environment"`);
  }
}
