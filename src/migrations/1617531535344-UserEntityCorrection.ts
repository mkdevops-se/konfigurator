import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntityCorrection1617531535344 implements MigrationInterface {
  name = 'UserEntityCorrection1617531535344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user"
       (
         "user_id"                  varying character PRIMARY KEY NOT NULL,
         "id"                       varying character,
         "provider"                 varying character,
         "display_name"             varying character,
         "nickname"                 varying character,
         "family_name"              varying character,
         "given_name"               varying character,
         "email"                    varying character,
         "identities"               text,
         "groups"                   text,
         "picture_url"              varying character,
         "locale"                   varying character,
         "konfigurator_login_count" integer                       NOT NULL DEFAULT (0),
         "konfigurator_super_admin" boolean                       NOT NULL DEFAULT (0),
         "created_at"               datetime                      NOT NULL DEFAULT (datetime('now')),
         "updated_at"               datetime                      NOT NULL DEFAULT (datetime('now'))
       )`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("user_id", "id", "provider", "display_name", "nickname", "family_name",
                                    "given_name", "email", "identities", "groups", "picture_url", "locale",
                                    "konfigurator_login_count", "konfigurator_super_admin", "created_at", "updated_at")
       SELECT "user_id",
              "id",
              "provider",
              "display_name",
              "nickname",
              "family_name",
              "given_name",
              "email",
              "identities",
              "groups",
              "picture_url",
              "locale",
              "konfigurator_login_count",
              "konfigurator_super_admin",
              "created_at",
              "updated_at"
       FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user"
      RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
      RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user"
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
    await queryRunner.query(
      `INSERT INTO "user"("user_id", "id", "provider", "display_name", "nickname", "family_name", "given_name", "email",
                          "identities", "groups", "picture_url", "locale", "konfigurator_login_count",
                          "konfigurator_super_admin", "created_at", "updated_at")
       SELECT "user_id",
              "id",
              "provider",
              "display_name",
              "nickname",
              "family_name",
              "given_name",
              "email",
              "identities",
              "groups",
              "picture_url",
              "locale",
              "konfigurator_login_count",
              "konfigurator_super_admin",
              "created_at",
              "updated_at"
       FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
