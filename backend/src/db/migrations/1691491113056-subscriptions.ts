import { MigrationInterface, QueryRunner } from 'typeorm';

export class subscriptions1691491113056 implements MigrationInterface {
  name = 'subscriptions1691491113056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "follower_id" integer, "followed_id" integer, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a97c3ebf1bef5345852963e4c" ON "subscription" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b52b9aae50d89a98d3ef92c8d" ON "subscription" ("deleted_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_311b852cec90f8f0a7a78da2164"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_8c37874e2671674e05b6a7ad186"`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b52b9aae50d89a98d3ef92c8d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a97c3ebf1bef5345852963e4c"`,
    );
    await queryRunner.query(`DROP TABLE "subscription"`);
  }
}
