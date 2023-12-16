/*
  Warnings:

  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "comment" RENAME CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" TO "comment_pkey";

-- AlterTable
ALTER TABLE "comment_like" RENAME CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" TO "comment_like_pkey";

-- AlterTable
ALTER TABLE "event" RENAME CONSTRAINT "PK_2515098fbdaa581436013ab7a60" TO "event_pkey";

-- AlterTable
ALTER TABLE "favorite_list" RENAME CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" TO "favorite_list_pkey";

-- AlterTable
ALTER TABLE "film" RENAME CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" TO "film_pkey";

-- AlterTable
ALTER TABLE "list" RENAME CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" TO "list_pkey";

-- AlterTable
ALTER TABLE "list_like" RENAME CONSTRAINT "PK_08d899a0a4870c8959ddf52a604" TO "list_like_pkey";

-- AlterTable
ALTER TABLE "list_view" RENAME CONSTRAINT "PK_4d9833b647fd9eacd77ed374854" TO "list_view_pkey";

-- AlterTable
ALTER TABLE "migrations" RENAME CONSTRAINT "PK_8c82d7f526340ab734260ea46be" TO "migrations_pkey";

-- AlterTable
ALTER TABLE "review" RENAME CONSTRAINT "PK_2e4299a343a81574217255c00ca" TO "review_pkey";

-- AlterTable
ALTER TABLE "to_watch" RENAME CONSTRAINT "PK_0fd820af7972ef612ea0e17ae21" TO "to_watch_pkey";

-- AlterTable
ALTER TABLE "users" RENAME CONSTRAINT "PK_cace4a159ff9f2512dd42373760" TO "users_pkey";

-- DropTable
DROP TABLE "task";

-- DropEnum
DROP TYPE "task_task_type_enum";

-- RenameForeignKey
ALTER TABLE "comment" RENAME CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" TO "comment_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "comment" RENAME CONSTRAINT "FK_cfc14dc2cafa339954de748ebf3" TO "comment_reply_to_id_fkey";

-- RenameForeignKey
ALTER TABLE "comment" RENAME CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9" TO "comment_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "comment_like" RENAME CONSTRAINT "FK_a253dba95eab8659c027bbace44" TO "comment_like_comment_id_fkey";

-- RenameForeignKey
ALTER TABLE "comment_like" RENAME CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" TO "comment_like_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "favorite_list" RENAME CONSTRAINT "FK_21938075574309780e33688b0a5" TO "favorite_list_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "favorite_list" RENAME CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd" TO "favorite_list_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "list" RENAME CONSTRAINT "FK_46ded14b26382088c9f032f8953" TO "list_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "list_like" RENAME CONSTRAINT "FK_2f7811183028e0c3b9a66f34957" TO "list_like_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "list_like" RENAME CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36" TO "list_like_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "list_view" RENAME CONSTRAINT "FK_4217d199530fdd010220d8d473a" TO "list_view_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "list_view" RENAME CONSTRAINT "FK_a8a0aa213e144f932c9793a6953" TO "list_view_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "review" RENAME CONSTRAINT "FK_1337f93918c70837d3cea105d39" TO "review_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "review" RENAME CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c" TO "review_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "review" RENAME CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" TO "review_filmId_fkey";

-- RenameForeignKey
ALTER TABLE "to_watch" RENAME CONSTRAINT "FK_9e1aabc3453a7c955553f498c6e" TO "to_watch_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "to_watch" RENAME CONSTRAINT "FK_b678c932a26ad586d6afd5ee42c" TO "to_watch_filmId_fkey";

-- RenameIndex
ALTER INDEX "subscription_created_at_idx" RENAME TO "IDX_created_at";

-- RenameIndex
ALTER INDEX "subscription_deleted_at_idx" RENAME TO "IDX_deleted_at";

-- RenameIndex
ALTER INDEX "UQ_78a916df40e02a9deb1c4b75edb" RENAME TO "users_username_key";

-- RenameIndex
ALTER INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" RENAME TO "users_email_key";
