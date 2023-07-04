import { MigrationInterface, QueryRunner } from 'typeorm';

export class usernameAndListSearch1688427577895 implements MigrationInterface {
  name = 'usernameAndListSearch1688427577895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    //list

    await queryRunner.query(
      `ALTER TABLE "list" ADD "search_document" tsvector`,
    );

    await queryRunner.query(`
          CREATE INDEX search_list_document_idx
          ON list
          USING GIN (search_document)
        `);

    await queryRunner.query(`
          CREATE FUNCTION to_list_tsvector() RETURNS trigger as $$
            begin
              new.search_document := setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(new.description, '')), 'B');
            return new;
          end
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
      UPDATE "list" SET search_document = setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(description, '')), 'B');
    `);

    await queryRunner.query(`
        CREATE TRIGGER list_tsvector_update BEFORE INSERT OR UPDATE ON list
        FOR EACH ROW EXECUTE PROCEDURE to_list_tsvector(); 
      `);

    await queryRunner.query(`
      ALTER TABLE "list" ALTER COLUMN "search_document" SET NOT NULL;
    `);

    // username

    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD "username_search_document" tsvector`,
    );

    await queryRunner.query(`
    CREATE INDEX username_search_document_idx
    ON "public"."user"
    USING GIN (username_search_document) 
        `);

    await queryRunner.query(`
          CREATE FUNCTION to_username_tsvector() RETURNS trigger as $$
            begin
              new.username_search_document := to_tsvector('simple', coalesce(new.username, ''));
            return new;
          end
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
      UPDATE "public"."user" SET username_search_document = to_tsvector('simple', coalesce(username, ''));
    `);

    await queryRunner.query(`
        CREATE TRIGGER username_tsvector_update BEFORE INSERT OR UPDATE ON "public"."user"
        FOR EACH ROW EXECUTE PROCEDURE to_username_tsvector(); 
      `);

    await queryRunner.query(`
      ALTER TABLE "public"."user" ALTER COLUMN "username_search_document" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // list
    await queryRunner.query(`
        DROP INDEX "search_list_document_idx"
      `);

    await queryRunner.query(`DROP TRIGGER list_tsvector_update on "list"`);

    await queryRunner.query(`
        DROP FUNCTION "to_list_tsvector"`);

    await queryRunner.query(`ALTER TABLE "list" DROP COLUMN "search_document"`);

    // username
    await queryRunner.query(`
        DROP INDEX "username_search_document_idx"
      `);

    await queryRunner.query(
      `DROP TRIGGER username_tsvector_update on "public"."user"`,
    );

    await queryRunner.query(`
        DROP FUNCTION "to_username_tsvector"`);

    await queryRunner.query(
      `ALTER TABLE "public"."user" DROP COLUMN "username_search_document"`,
    );
  }
}
