-- migrate:up

-- Rename tables
ALTER TABLE "list" RENAME TO "collections";
ALTER TABLE "list_like" RENAME TO "collection_likes";
ALTER TABLE "list_view" RENAME TO "collection_views";
ALTER TABLE "favorite_list" RENAME TO "favorite_collections";

-- Update foreign key constraints to use new table names
ALTER TABLE "collection_likes" RENAME CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36" TO "FK_collection_likes_collection_id";
ALTER TABLE "collection_views" RENAME CONSTRAINT "FK_4217d199530fdd010220d8d473a" TO "FK_collection_views_collection_id";
ALTER TABLE "favorite_collections" RENAME CONSTRAINT "FK_21938075574309780e33688b0a5" TO "FK_favorite_collections_collection_id";
ALTER TABLE "review" RENAME CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c" TO "FK_reviews_collection_id";
ALTER TABLE "comment" RENAME CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9" TO "FK_comments_collection_id";

-- Rename review table and adjust columns
ALTER TABLE "review" RENAME TO "reviews";
ALTER TABLE "reviews" DROP COLUMN "tags";
ALTER TABLE "reviews" DROP COLUMN "order_in_list";
ALTER TABLE "reviews" DROP COLUMN "deleted_at";

-- Rename and adjust films table columns
ALTER TABLE "film" RENAME TO "films";

-- Rename and adjust users table
ALTER TABLE "users" DROP COLUMN "email";
ALTER TABLE "users" DROP COLUMN "deleted_at";

-- Rename and adjust collections table columns
ALTER TABLE "collections" DROP COLUMN "show_rating";
ALTER TABLE "collections" DROP COLUMN "show_description";
ALTER TABLE "collections" DROP COLUMN "deleted_at";

-- Rename subscription table and adjust columns
ALTER TABLE "subscription" RENAME TO "subscriptions";
ALTER TABLE "subscriptions" RENAME COLUMN "follower_id" TO "from_user_id";
ALTER TABLE "subscriptions" RENAME COLUMN "followed_id" TO "to_user_id";
ALTER TABLE "favorite_collections" RENAME COLUMN "list_id" TO "collection_id";

ALTER TABLE "subscriptions" DROP COLUMN "deleted_at";

-- Remove deleted_at from other tables
ALTER TABLE "collection_likes" DROP COLUMN "deleted_at";
ALTER TABLE "collection_views" DROP COLUMN "deleted_at";
ALTER TABLE "favorite_collections" DROP COLUMN "deleted_at";

-- Drop unused tables
DROP TABLE "comment" CASCADE;
DROP TABLE "comment_like" CASCADE;
DROP TABLE "to_watch" CASCADE;
DROP TABLE "task" CASCADE;

-- migrate:down

-- Restore original table names
ALTER TABLE "collections" RENAME TO "list";
ALTER TABLE "collection_likes" RENAME TO "list_like";
ALTER TABLE "collection_views" RENAME TO "list_view";
ALTER TABLE "favorite_collections" RENAME TO "favorite_list";
ALTER TABLE "reviews" RENAME TO "review";
ALTER TABLE "films" RENAME TO "film";
ALTER TABLE "subscriptions" RENAME TO "subscription";

-- Restore foreign key constraint names
ALTER TABLE "list_like" RENAME CONSTRAINT "FK_collection_likes_collection_id" TO "FK_36bbfd04f2ebcc31a9c42450c36";
ALTER TABLE "list_view" RENAME CONSTRAINT "FK_collection_views_collection_id" TO "FK_4217d199530fdd010220d8d473a";
ALTER TABLE "favorite_list" RENAME CONSTRAINT "FK_favorite_collections_collection_id" TO "FK_21938075574309780e33688b0a5";
ALTER TABLE "review" RENAME CONSTRAINT "FK_reviews_collection_id" TO "FK_37e516b0d42e6a177cbbb15da8c";
ALTER TABLE "list" RENAME CONSTRAINT "FK_comments_collection_id" TO "FK_fc8455c31a9e1a7cfeb0ead49a9";

-- Note: Cannot restore dropped columns and tables in down migration
-- You would need to manually restore the data structure if rolling back

