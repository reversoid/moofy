import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameUserTable1690564948789 implements MigrationInterface {
  name = 'renameUserTable1690564948789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME TO users`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users RENAME TO "user"`);
  }
}
