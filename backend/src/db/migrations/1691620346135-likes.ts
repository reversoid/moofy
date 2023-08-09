import { MigrationInterface, QueryRunner } from 'typeorm';

export class likes1691620346135 implements MigrationInterface {
  name = 'likes1691620346135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment_like" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "commentId" integer, CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15eb3b90a408e3222e1ef34035" ON "comment_like" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e9f9d450d42a53a579dd00c38" ON "comment_like" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "list_like" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "listId" integer, CONSTRAINT "PK_08d899a0a4870c8959ddf52a604" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_72bcd910d3caf258faded7e777" ON "list_like" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d47abc4c0e4671f5bf00af599" ON "list_like" ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_like" ADD CONSTRAINT "FK_2f7811183028e0c3b9a66f34957" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_like" ADD CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_like" DROP CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_like" DROP CONSTRAINT "FK_2f7811183028e0c3b9a66f34957"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_a253dba95eab8659c027bbace44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0d47abc4c0e4671f5bf00af599"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_72bcd910d3caf258faded7e777"`,
    );
    await queryRunner.query(`DROP TABLE "list_like"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e9f9d450d42a53a579dd00c38"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15eb3b90a408e3222e1ef34035"`,
    );
    await queryRunner.query(`DROP TABLE "comment_like"`);
  }
}
