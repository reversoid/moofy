import { MigrationInterface, QueryRunner } from 'typeorm';

export class revewSearch1687621563210 implements MigrationInterface {
  name = 'revewSearch1687621563210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review" ADD "search_document" tsvector`,
    );

    await queryRunner.query(`
          CREATE INDEX search_review_document_idx
          ON review
          USING GIN (search_document)
        `);

    await queryRunner.query(`
          CREATE FUNCTION to_review_tsvector() RETURNS trigger as $$
            begin
              new.search_document := to_tsvector('simple', coalesce(new.description, ''));
            return new;
          end
          $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
      UPDATE "review" SET search_document = to_tsvector('simple', coalesce(description, ''));
    `);

    await queryRunner.query(`
        CREATE TRIGGER review_tsvector_update BEFORE INSERT OR UPDATE ON review
        FOR EACH ROW EXECUTE PROCEDURE to_review_tsvector(); 
      `);

    await queryRunner.query(`
      ALTER TABLE "review" ALTER COLUMN "search_document" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "search_review_document_idx"
      `);

    await queryRunner.query(`DROP TRIGGER review_tsvector_update on "review"`);

    await queryRunner.query(`
        DROP FUNCTION "to_review_tsvector"`);

    await queryRunner.query(
      `ALTER TABLE "review" DROP COLUMN "search_document"`,
    );
  }
}
