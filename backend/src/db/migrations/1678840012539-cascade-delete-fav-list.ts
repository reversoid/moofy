import { MigrationInterface, QueryRunner } from 'typeorm';

export class cascadeDeleteFavList1678840012539 implements MigrationInterface {
  name = 'cascadeDeleteFavList1678840012539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_list" DROP CONSTRAINT "FK_21938075574309780e33688b0a5"`,
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
      `ALTER TABLE "favorite_list" ADD CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
