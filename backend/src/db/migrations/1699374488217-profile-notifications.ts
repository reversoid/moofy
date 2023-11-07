import { MigrationInterface, QueryRunner } from "typeorm";

export class profileNotifications1699374488217 implements MigrationInterface {
    name = 'profileNotifications1699374488217'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TYPE "public"."profile_event_type_enum" AS ENUM('LIST_LIKE', 'COMMENT_LIKE', 'COMMENT', 'REPLY', 'SUBSCRIBE')`);
        await queryRunner.query(`CREATE TABLE "profile_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_from_id" integer, "user_to_id" integer NOT NULL, "target_id" integer, "type" "public"."profile_event_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "seen_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2515098fbdaa581436013ab7a60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b030364dc2366e22513c8b521" ON "profile_event" ("user_to_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c13216c673eef88943fdc684e3" ON "profile_event" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_8309c84989285fe1c67372c6d5" ON "profile_event" ("seen_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX "public"."IDX_8309c84989285fe1c67372c6d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c13216c673eef88943fdc684e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b030364dc2366e22513c8b521"`);
        await queryRunner.query(`DROP TABLE "profile_event"`);
        await queryRunner.query(`DROP TYPE "public"."profile_event_type_enum"`);
        
    }

}
