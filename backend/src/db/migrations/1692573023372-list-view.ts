import { MigrationInterface, QueryRunner } from 'typeorm';

export class listView1692572849110 implements MigrationInterface {
  name = 'listView1692572849110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "list_view" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "listId" integer NOT NULL, CONSTRAINT "PK_4d9833b647fd9eacd77ed374854" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view" ADD CONSTRAINT "FK_a8a0aa213e144f932c9793a6953" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view" ADD CONSTRAINT "FK_4217d199530fdd010220d8d473a" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "list_view" DROP CONSTRAINT "FK_4217d199530fdd010220d8d473a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list_view" DROP CONSTRAINT "FK_a8a0aa213e144f932c9793a6953"`,
    );
    await queryRunner.query(`DROP TABLE "list_view"`);
  }
}
