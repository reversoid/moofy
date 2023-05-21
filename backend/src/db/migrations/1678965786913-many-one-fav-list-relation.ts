import { MigrationInterface, QueryRunner } from 'typeorm';

export class manyOneFavListRelation1678965786913 implements MigrationInterface {
  name = 'manyOneFavListRelation1678965786913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_list" DROP CONSTRAINT "FK_21938075574309780e33688b0a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_list" DROP CONSTRAINT "REL_21938075574309780e33688b0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_list" ADD CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_list" DROP CONSTRAINT "FK_21938075574309780e33688b0a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_list" ADD CONSTRAINT "REL_21938075574309780e33688b0a" UNIQUE ("listId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_list" ADD CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
