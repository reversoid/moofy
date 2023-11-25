DELETE FROM "subscription" WHERE "follower_id" IS NULL or "followed_id" IS NULL;

ALTER TABLE "subscription" RENAME CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" TO "subscription_pkey";
ALTER TABLE "subscription" ALTER COLUMN "follower_id" SET NOT NULL;
ALTER TABLE "subscription" ALTER COLUMN "followed_id" SET NOT NULL;

ALTER TABLE "subscription" ADD CONSTRAINT "subscription_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER INDEX "IDX_8b52b9aae50d89a98d3ef92c8d" RENAME TO "subscription_deleted_at_idx";
ALTER INDEX "IDX_9a97c3ebf1bef5345852963e4c" RENAME TO "subscription_created_at_idx";