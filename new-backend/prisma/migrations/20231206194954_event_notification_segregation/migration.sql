/*
  Warnings:

  - You are about to drop the `profile_event` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "event_type_enum" AS ENUM ('LIST_LIKED', 'LIST_VIEWED', 'COMMENT_LIKED', 'COMMENT_CREATED', 'REVIEW_CREATED', 'REPLY_CREATED', 'LIST_CREATED', 'SUBSCRIBED');

-- DropTable
DROP TABLE "profile_event";

-- DropEnum
DROP TYPE "profile_event_type_enum";

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "target_id" INTEGER NOT NULL,
    "type" "event_type_enum" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "PK_2515098fbdaa581436013ab7a60" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "event_id" UUID NOT NULL,
    "seen_at" TIMESTAMPTZ(6),
    "from_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
