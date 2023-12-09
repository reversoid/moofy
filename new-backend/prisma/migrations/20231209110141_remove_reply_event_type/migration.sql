/*
  Warnings:

  - The values [REPLY_CREATED] on the enum `event_type_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "event_type_enum_new" AS ENUM ('LIST_LIKED', 'LIST_VIEWED', 'COMMENT_LIKED', 'COMMENT_CREATED', 'REVIEW_CREATED', 'LIST_CREATED', 'SUBSCRIBED');
ALTER TABLE "event" ALTER COLUMN "type" TYPE "event_type_enum_new" USING ("type"::text::"event_type_enum_new");
ALTER TYPE "event_type_enum" RENAME TO "event_type_enum_old";
ALTER TYPE "event_type_enum_new" RENAME TO "event_type_enum";
DROP TYPE "event_type_enum_old";
COMMIT;
