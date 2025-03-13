-- migrate:up

ALTER TABLE "collection_views"
RENAME COLUMN "list_id" TO "collection_id";

-- migrate:down

ALTER TABLE "collection_views"
RENAME COLUMN "collection_id" TO "list_id";
