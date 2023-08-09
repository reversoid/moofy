import { MigrationInterface, QueryRunner } from 'typeorm';

export class comments1691609904370 implements MigrationInterface {
  name = 'comments1691609904370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "text" character varying(400) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "replyToId" integer, "listId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_84eaa1e0d08e574fb78fd3c9b3" ON "comment" ("text") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9611a099501597c519429f2595" ON "comment" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f7c693bc26ed21008acead3b3" ON "comment" ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_cfc14dc2cafa339954de748ebf3" FOREIGN KEY ("replyToId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_cfc14dc2cafa339954de748ebf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f7c693bc26ed21008acead3b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9611a099501597c519429f2595"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_84eaa1e0d08e574fb78fd3c9b3"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
