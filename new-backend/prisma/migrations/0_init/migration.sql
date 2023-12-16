CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "film_type_enum" AS ENUM (
    'FILM',
    'TV_SERIES',
    'TV_SHOW',
    'MINI_SERIES',
    'VIDEO'
);

-- CreateEnum
CREATE TYPE "profile_event_type_enum" AS ENUM (
    'LIST_LIKE',
    'COMMENT_LIKE',
    'COMMENT',
    'REPLY',
    'SUBSCRIBE'
);

-- CreateEnum
CREATE TYPE "task_task_type_enum" AS ENUM ('AUTH', 'REVIEW', 'LIST');

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(400) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,
    "replyToId" INTEGER,
    "listId" INTEGER,
    CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_like" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_list" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,
    "listId" INTEGER,
    CONSTRAINT "PK_298ea5adef17b30abd7df2d3a1d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "film" (
    "id" VARCHAR(32) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "year" SMALLINT NOT NULL,
    "type" "film_type_enum" NOT NULL,
    "filmLength" CHAR(6),
    "posterPreviewUrl" VARCHAR(120),
    "posterUrl" VARCHAR(120),
    "genres" VARCHAR(32) [],
    "search_document" tsvector NOT NULL,
    CONSTRAINT "PK_37ec0ffe0011ccbe438a65e3c6e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "description" VARCHAR(400),
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "show_rating" BOOLEAN NOT NULL DEFAULT false,
    "show_description" BOOLEAN NOT NULL DEFAULT true,
    "image_url" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,
    "search_document" tsvector NOT NULL,
    CONSTRAINT "PK_d8feafd203525d5f9c37b3ed3b9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_like" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,
    CONSTRAINT "PK_08d899a0a4870c8959ddf52a604" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_view" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "userId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,
    CONSTRAINT "PK_4d9833b647fd9eacd77ed374854" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_event" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_from_id" INTEGER,
    "user_to_id" INTEGER NOT NULL,
    "target_id" INTEGER,
    "type" "profile_event_type_enum" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "seen_at" TIMESTAMPTZ(6),
    CONSTRAINT "PK_2515098fbdaa581436013ab7a60" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "score" SMALLINT,
    "description" VARCHAR(400),
    "tags" VARCHAR(32) [],
    "order_in_list" DECIMAL(20, 16) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filmId" VARCHAR(32) NOT NULL,
    "userId" INTEGER NOT NULL,
    "listId" INTEGER NOT NULL,
    "search_document" tsvector NOT NULL,
    CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "follower_id" INTEGER,
    "followed_id" INTEGER,
    CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "task_date" TIMESTAMPTZ(6) NOT NULL,
    "task_type" "task_task_type_enum" NOT NULL,
    "task_name" VARCHAR(32) NOT NULL,
    CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "to_watch" (
    "id" SERIAL NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "filmId" VARCHAR(32) NOT NULL,
    CONSTRAINT "PK_0fd820af7972ef612ea0e17ae21" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "email" VARCHAR(256),
    "description" VARCHAR(400),
    "image_url" VARCHAR(120),
    "password_hash" CHAR(60) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "username_search_document" tsvector NOT NULL,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_1f7c693bc26ed21008acead3b3" ON "comment"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_84eaa1e0d08e574fb78fd3c9b3" ON "comment"("text");

-- CreateIndex
CREATE INDEX "IDX_9611a099501597c519429f2595" ON "comment"("created_at");

-- CreateIndex
CREATE INDEX "IDX_15eb3b90a408e3222e1ef34035" ON "comment_like"("created_at");

-- CreateIndex
CREATE INDEX "IDX_2e9f9d450d42a53a579dd00c38" ON "comment_like"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_4d2005680706ade52516a9b24b" ON "favorite_list"("created_at");

-- CreateIndex
CREATE INDEX "IDX_bcfc7a2063b16b9532c482ea27" ON "favorite_list"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_5a82570b7c5f8d77972f7ef76a" ON "film"("year");

-- CreateIndex
CREATE INDEX "IDX_5aa49498820d9f4e5afb35254b" ON "film"("genres");

-- CreateIndex
CREATE INDEX "IDX_70c253d5411a4abf1c752a4699" ON "film"("name");

-- CreateIndex
CREATE INDEX "IDX_c1b1047b4293e41323a080e220" ON "film"("type");

-- CreateIndex
CREATE INDEX "IDX_ff4c1609981279c3df153fda3c" ON "film"("filmLength");

-- CreateIndex
CREATE INDEX "search_film_document_idx" ON "film" USING GIN ("search_document");

-- CreateIndex
CREATE INDEX "IDX_0e35629d588558a1871982f2d2" ON "list"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_77b6e8e786643c3e78280800e1" ON "list"("updated_at");

-- CreateIndex
CREATE INDEX "IDX_80b7c880992ddf646c03674f80" ON "list"("created_at");

-- CreateIndex
CREATE INDEX "IDX_d7ff6872c82ac4a87ff986a38d" ON "list"("name");

-- CreateIndex
CREATE INDEX "search_list_document_idx" ON "list" USING GIN ("search_document");

-- CreateIndex
CREATE INDEX "IDX_0d47abc4c0e4671f5bf00af599" ON "list_like"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_72bcd910d3caf258faded7e777" ON "list_like"("created_at");

-- CreateIndex
CREATE INDEX "IDX_8309c84989285fe1c67372c6d5" ON "profile_event"("seen_at");

-- CreateIndex
CREATE INDEX "IDX_8b030364dc2366e22513c8b521" ON "profile_event"("user_to_id");

-- CreateIndex
CREATE INDEX "IDX_c13216c673eef88943fdc684e3" ON "profile_event"("created_at");

-- CreateIndex
CREATE INDEX "IDX_004547e1fee5af6fc9fd3de095" ON "review"("created_at");

-- CreateIndex
CREATE INDEX "IDX_5fc50495948dd3c91bfec4276a" ON "review"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_e045ebbb33ef7af0d13176f55b" ON "review"("updated_at");

-- CreateIndex
CREATE INDEX "search_review_document_idx" ON "review" USING GIN ("search_document");

-- CreateIndex
CREATE INDEX "IDX_8b52b9aae50d89a98d3ef92c8d" ON "subscription"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_9a97c3ebf1bef5345852963e4c" ON "subscription"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_33394d9f1edb8dada30dd4c903" ON "task"("task_name");

-- CreateIndex
CREATE INDEX "IDX_4bec8d4c2bb9e78f4eadc80830" ON "task"("task_type");

-- CreateIndex
CREATE INDEX "IDX_939fa09e877d128e141e49f716" ON "task"("task_date");

-- CreateIndex
CREATE INDEX "IDX_2a0b9c4cf6de3f70c174a9a4c9" ON "to_watch"("watched");

-- CreateIndex
CREATE INDEX "IDX_9e1aabc3453a7c955553f498c6" ON "to_watch"("userId");

-- CreateIndex
CREATE INDEX "IDX_b678c932a26ad586d6afd5ee42" ON "to_watch"("filmId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_78a916df40e02a9deb1c4b75edb" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "users"("email");

-- CreateIndex
CREATE INDEX "IDX_22b81d3ed19a0bffcb660800f4" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "IDX_9cdce43fa0043c794281aa0905" ON "users"("updated_at");

-- CreateIndex
CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "username_search_document_idx" ON "users" USING GIN ("username_search_document");

-- AddForeignKey
ALTER TABLE
    "comment"
ADD
    CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "comment"
ADD
    CONSTRAINT "FK_cfc14dc2cafa339954de748ebf3" FOREIGN KEY ("replyToId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "comment"
ADD
    CONSTRAINT "FK_fc8455c31a9e1a7cfeb0ead49a9" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "comment_like"
ADD
    CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "comment_like"
ADD
    CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "favorite_list"
ADD
    CONSTRAINT "FK_21938075574309780e33688b0a5" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "favorite_list"
ADD
    CONSTRAINT "FK_fbbb4b0b4654357a4bd1138ccbd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "list"
ADD
    CONSTRAINT "FK_46ded14b26382088c9f032f8953" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "list_like"
ADD
    CONSTRAINT "FK_2f7811183028e0c3b9a66f34957" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "list_like"
ADD
    CONSTRAINT "FK_36bbfd04f2ebcc31a9c42450c36" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "list_view"
ADD
    CONSTRAINT "FK_4217d199530fdd010220d8d473a" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "list_view"
ADD
    CONSTRAINT "FK_a8a0aa213e144f932c9793a6953" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "review"
ADD
    CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "review"
ADD
    CONSTRAINT "FK_37e516b0d42e6a177cbbb15da8c" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "review"
ADD
    CONSTRAINT "FK_f1a2e33731808a7c6fcd644ca7c" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "to_watch"
ADD
    CONSTRAINT "FK_9e1aabc3453a7c955553f498c6e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "to_watch"
ADD
    CONSTRAINT "FK_b678c932a26ad586d6afd5ee42c" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Review triggers
CREATE FUNCTION to_review_tsvector() RETURNS trigger as $$ begin new.search_document := to_tsvector('simple', coalesce(new.description, ''));

return new;

end $$ LANGUAGE plpgsql;

UPDATE
    "review"
SET
    search_document = to_tsvector('simple', coalesce(description, ''));

CREATE TRIGGER review_tsvector_update BEFORE
INSERT
    OR
UPDATE
    ON review FOR EACH ROW EXECUTE PROCEDURE to_review_tsvector();

-- Film triggers
CREATE FUNCTION to_film_tsvector() RETURNS trigger as $$ begin new.search_document := to_tsvector('simple', coalesce(new.name, ''));

return new;

end $$ LANGUAGE plpgsql;

UPDATE
    "film"
SET
    search_document = to_tsvector('simple', coalesce(name, ''));

CREATE TRIGGER film_tsvector_update BEFORE
INSERT
    OR
UPDATE
    ON film FOR EACH ROW EXECUTE PROCEDURE to_film_tsvector();

-- list triggers
CREATE FUNCTION to_list_tsvector() RETURNS trigger as $$ begin new.search_document := setweight(
    to_tsvector('simple', coalesce(new.name, '')),
    'A'
) || setweight(
    to_tsvector('simple', coalesce(new.description, '')),
    'B'
);

return new;

end $$ LANGUAGE plpgsql;

UPDATE
    "list"
SET
    search_document = setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(
        to_tsvector('simple', coalesce(description, '')),
        'B'
    );

CREATE TRIGGER list_tsvector_update BEFORE
INSERT
    OR
UPDATE
    ON list FOR EACH ROW EXECUTE PROCEDURE to_list_tsvector();

-- user triggers
CREATE FUNCTION to_username_tsvector() RETURNS trigger as $$ begin new.username_search_document := to_tsvector('simple', coalesce(new.username, ''));

return new;

end $$ LANGUAGE plpgsql;

UPDATE
    "users"
SET
    username_search_document = to_tsvector('simple', coalesce(username, ''));

CREATE TRIGGER username_tsvector_update BEFORE
INSERT
    OR
UPDATE
    ON "users" FOR EACH ROW EXECUTE PROCEDURE to_username_tsvector();