import { MigrationInterface, QueryRunner } from 'typeorm';

export class filmFullTextNameSearch1687626263358 implements MigrationInterface {
  name = 'filmFullTextNameSearch1687626263358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "film" ADD "search_document" tsvector`,
    );

    await queryRunner.query(`
          CREATE INDEX search_film_document_idx
          ON film
          USING GIN (search_document)
        `);

    await queryRunner.query(`
          CREATE FUNCTION to_film_tsvector() RETURNS trigger as $$
            begin
              new.search_document := to_tsvector('simple', coalesce(new.name, ''));
            return new;
          end
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
      UPDATE "film" SET search_document = to_tsvector('simple', coalesce(new.name, ''));
    `);

    await queryRunner.query(`
        CREATE TRIGGER film_tsvector_update BEFORE INSERT OR UPDATE ON film
        FOR EACH ROW EXECUTE PROCEDURE to_film_tsvector(); 
      `);

    await queryRunner.query(`
      ALTER TABLE "film" ALTER COLUMN "search_document" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "search_film_document_idx"
      `);

    await queryRunner.query(`DROP TRIGGER film_tsvector_update on "film"`);

    await queryRunner.query(`
        DROP FUNCTION "to_film_tsvector"`);

    await queryRunner.query(`ALTER TABLE "film" DROP COLUMN "search_document"`);
  }
}
