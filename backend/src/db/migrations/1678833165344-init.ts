import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1678833165344 implements MigrationInterface {
  name = 'init1678833165344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "to_watch" ("id" SERIAL NOT NULL, "watched" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, "filmId" character varying(32) NOT NULL, CONSTRAINT "PK_0fd820af7972ef612ea0e17ae21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_2a0b9c4cf6de3f70c174a9a4c9" ON "to_watch" ("watched") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_9e1aabc3453a7c955553f498c6" ON "to_watch" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_b678c932a26ad586d6afd5ee42" ON "to_watch" ("filmId") `,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "favorite_list" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "listId" integer, CONSTRAINT "REL_21938075574309780e33688b0a" UNIQUE ("listId"), CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_4d2005680706ade52516a9b24b" ON "favorite_list" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_bcfc7a2063b16b9532c482ea27" ON "favorite_list" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" ("id" SERIAL NOT NULL, "username" character varying(32) NOT NULL, "email" character varying(256), "description" character varying(400), "image_url" character varying(120), "password_hash" character(60) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_d091f1d36f18bbece2a9eabc6e" ON "user" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_9cdce43fa0043c794281aa0905" ON "user" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_22b81d3ed19a0bffcb660800f4" ON "user" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "list" ("id" SERIAL NOT NULL, "name" character varying(32) NOT NULL, "description" character varying(400), "is_public" boolean NOT NULL DEFAULT false, "show_rating" boolean NOT NULL DEFAULT false, "show_description" boolean NOT NULL DEFAULT true, "image_url" character varying(120), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_d7ff6872c82ac4a87ff986a38d" ON "list" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_80b7c880992ddf646c03674f80" ON "list" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_77b6e8e786643c3e78280800e1" ON "list" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_0e35629d588558a1871982f2d2" ON "list" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "review" ("id" SERIAL NOT NULL, "score" smallint, "description" character varying(400), "tags" character varying(32) array, "order_in_list" numeric(20,16) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "filmId" character varying(32) NOT NULL, "userId" integer NOT NULL, "listId" integer NOT NULL, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_004547e1fee5af6fc9fd3de095" ON "review" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_5fc50495948dd3c91bfec4276a" ON "review" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_e045ebbb33ef7af0d13176f55b" ON "review" ("updated_at") `,
    );

    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      CREATE TYPE "public"."film_type_enum" AS ENUM('FILM', 'TV_SERIES', 'TV_SHOW', 'MINI_SERIES', 'VIDEO');
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'type  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "film" ("id" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "year" smallint NOT NULL, "type" "public"."film_type_enum" NOT NULL, "filmLength" character(6), "posterPreviewUrl" character varying(120), "posterUrl" character varying(120), "genres" character varying(32) array, CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_70c253d5411a4abf1c752a4699" ON "film" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_5a82570b7c5f8d77972f7ef76a" ON "film" ("year") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_c1b1047b4293e41323a080e220" ON "film" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_ff4c1609981279c3df153fda3c" ON "film" ("filmLength") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_5aa49498820d9f4e5afb35254b" ON "film" ("genres") `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      CREATE TYPE "public"."task_task_type_enum" AS ENUM('AUTH', 'REVIEW', 'LIST');
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'type  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "task" ("id" SERIAL NOT NULL, "task_date" TIMESTAMP WITH TIME ZONE NOT NULL, "task_type" "public"."task_task_type_enum" NOT NULL, "task_name" character varying(32) NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_939fa09e877d128e141e49f716" ON "task" ("task_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_4bec8d4c2bb9e78f4eadc80830" ON "task" ("task_type") `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      CREATE UNIQUE INDEX "IDX_33394d9f1edb8dada30dd4c903" ON "task" ("task_name");
      EXCEPTION WHEN DUPLICATE_TABLE THEN
        RAISE NOTICE 'index  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "to_watch" ADD CONSTRAINT "FK_9e1aabc3453a7c955553f498c6e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "to_watch" ADD CONSTRAINT "FK_b678c932a26ad586d6afd5ee42c" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "favorite_list" ADD CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "favorite_list" ADD CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "list" ADD CONSTRAINT "FK_46ded14b26382088c9f032f8953" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "review" ADD CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
    await queryRunner.query(
      `
      DO
      $$
      BEGIN
      ALTER TABLE "review" ADD CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'constraint  exists, skipping...';
      END
      $$;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "list" DROP CONSTRAINT "FK_46ded14b26382088c9f032f8953"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_list" DROP CONSTRAINT "FK_21938075574309780e33688b0a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_list" DROP CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "to_watch" DROP CONSTRAINT "FK_b678c932a26ad586d6afd5ee42c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "to_watch" DROP CONSTRAINT "FK_9e1aabc3453a7c955553f498c6e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_33394d9f1edb8dada30dd4c903"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4bec8d4c2bb9e78f4eadc80830"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_939fa09e877d128e141e49f716"`,
    );
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_task_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5aa49498820d9f4e5afb35254b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff4c1609981279c3df153fda3c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1b1047b4293e41323a080e220"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5a82570b7c5f8d77972f7ef76a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_70c253d5411a4abf1c752a4699"`,
    );
    await queryRunner.query(`DROP TABLE "film"`);
    await queryRunner.query(`DROP TYPE "public"."film_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e045ebbb33ef7af0d13176f55b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5fc50495948dd3c91bfec4276a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_004547e1fee5af6fc9fd3de095"`,
    );
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0e35629d588558a1871982f2d2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_77b6e8e786643c3e78280800e1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_80b7c880992ddf646c03674f80"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7ff6872c82ac4a87ff986a38d"`,
    );
    await queryRunner.query(`DROP TABLE "list"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_22b81d3ed19a0bffcb660800f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9cdce43fa0043c794281aa0905"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d091f1d36f18bbece2a9eabc6e"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bcfc7a2063b16b9532c482ea27"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d2005680706ade52516a9b24b"`,
    );
    await queryRunner.query(`DROP TABLE "favorite_list"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b678c932a26ad586d6afd5ee42"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e1aabc3453a7c955553f498c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a0b9c4cf6de3f70c174a9a4c9"`,
    );
    await queryRunner.query(`DROP TABLE "to_watch"`);
  }
}
