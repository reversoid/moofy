/*
  Warnings:

  - You are about to drop the column `search_document` on the `film` table. All the data in the column will be lost.
  - You are about to drop the column `search_document` on the `list` table. All the data in the column will be lost.
  - You are about to drop the column `search_document` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `username_search_document` on the `users` table. All the data in the column will be lost.

*/

-- DROP OLD TRIGGERS AND FUNCTIONS
DROP TRIGGER IF EXISTS review_tsvector_update ON review;
DROP FUNCTION IF EXISTS to_review_tsvector;

DROP TRIGGER IF EXISTS film_tsvector_update ON film;
DROP FUNCTION IF EXISTS to_film_tsvector;

DROP TRIGGER IF EXISTS list_tsvector_update ON list;
DROP FUNCTION IF EXISTS to_list_tsvector;

DROP TRIGGER IF EXISTS username_tsvector_update ON "users";
DROP FUNCTION IF EXISTS to_username_tsvector;


-- DropIndex
DROP INDEX "search_film_document_idx";

-- DropIndex
DROP INDEX "search_list_document_idx";

-- DropIndex
DROP INDEX "search_review_document_idx";

-- DropIndex
DROP INDEX "username_search_document_idx";

-- AlterTable
ALTER TABLE "film" DROP COLUMN "search_document";

-- AlterTable
ALTER TABLE "list" DROP COLUMN "search_document";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "search_document";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username_search_document";

-- CreateTable
CREATE TABLE "film_metadata" (
    "search_document" tsvector NOT NULL,
    "filmId" VARCHAR(32) NOT NULL,

    CONSTRAINT "film_metadata_pkey" PRIMARY KEY ("filmId")
);

-- CreateTable
CREATE TABLE "list_metadata" (
    "search_document" tsvector NOT NULL,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "list_metadata_pkey" PRIMARY KEY ("listId")
);

-- CreateTable
CREATE TABLE "review_metadata" (
    "search_document" tsvector NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "review_metadata_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "user_metadata" (
    "userId" INTEGER NOT NULL,
    "username_search_document" tsvector NOT NULL,

    CONSTRAINT "user_metadata_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "search_film_document_idx" ON "film_metadata" USING GIN ("search_document");

-- CreateIndex
CREATE INDEX "search_list_document_idx" ON "list_metadata" USING GIN ("search_document");

-- CreateIndex
CREATE INDEX "search_review_document_idx" ON "review_metadata" USING GIN ("search_document");

-- CreateIndex
CREATE INDEX "username_search_document_idx" ON "user_metadata" USING GIN ("username_search_document");

-- AddForeignKey
ALTER TABLE "film_metadata" ADD CONSTRAINT "film_metadata_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_metadata" ADD CONSTRAINT "list_metadata_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_metadata" ADD CONSTRAINT "review_metadata_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_metadata" ADD CONSTRAINT "user_metadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Film triggers
CREATE FUNCTION update_or_insert_film_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT * FROM film_metadata WHERE filmId = NEW.id) THEN
    UPDATE film_metadata
    SET search_document = to_tsvector('simple', coalesce(NEW.name, ''))
    WHERE filmId = NEW.id;
  ELSE
    INSERT INTO film_metadata (filmId, search_document)
    VALUES (NEW.id, to_tsvector('simple', coalesce(NEW.name, '')));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER film_metadata_tsvector_update BEFORE INSERT OR UPDATE
ON film FOR EACH ROW EXECUTE FUNCTION update_or_insert_film_metadata_tsvector();

-- list triggers
CREATE FUNCTION update_or_insert_list_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT * FROM list_metadata WHERE listId = NEW.id) THEN
    UPDATE list_metadata
    SET search_document = setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B')
    WHERE listId = NEW.id;
  ELSE
    INSERT INTO list_metadata (listId, search_document)
    VALUES (NEW.id, setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER list_metadata_tsvector_update BEFORE INSERT OR UPDATE
ON list FOR EACH ROW EXECUTE FUNCTION update_or_insert_list_metadata_tsvector();

-- review triggers
CREATE FUNCTION update_or_insert_review_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT * FROM review_metadata WHERE reviewId = NEW.id) THEN
    UPDATE review_metadata
    SET search_document = to_tsvector('simple', coalesce(NEW.description, ''))
    WHERE reviewId = NEW.id;
  ELSE
    INSERT INTO review_metadata (reviewId, search_document)
    VALUES (NEW.id, to_tsvector('simple', coalesce(NEW.description, '')));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_metadata_tsvector_update BEFORE INSERT OR UPDATE
ON review FOR EACH ROW EXECUTE FUNCTION update_or_insert_review_metadata_tsvector();

-- user triggers
CREATE FUNCTION update_or_insert_user_metadata_tsvector() RETURNS trigger AS $$
  BEGIN
    IF EXISTS (SELECT * FROM user_metadata WHERE userId = NEW.id) THEN
      UPDATE user_metadata
      SET username_search_document = to_tsvector('simple', coalesce(NEW.username, ''))
      WHERE userId = NEW.id;
    ELSE
      INSERT INTO user_metadata (userId, username_search_document)
      VALUES (NEW.id, to_tsvector('simple', coalesce(NEW.username, '')));
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_metadata_tsvector_update BEFORE INSERT OR UPDATE
ON "users" FOR EACH ROW EXECUTE FUNCTION update_or_insert_user_metadata_tsvector();

-- fill fields

-- fill film_metadata
INSERT INTO film_metadata ("filmId", search_document)
SELECT id, to_tsvector('simple', coalesce(name, ''))
FROM film;

-- fill list_metadata
INSERT INTO list_metadata ("listId", search_document)
SELECT id, setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(description, '')), 'B')
FROM list;

-- fill review_metadata
INSERT INTO review_metadata ("reviewId", search_document)
SELECT id, to_tsvector('simple', coalesce(description, ''))
FROM review;

-- fill user_metadata
INSERT INTO user_metadata ("userId", username_search_document)
SELECT id, to_tsvector('simple', coalesce(username, ''))
FROM users;