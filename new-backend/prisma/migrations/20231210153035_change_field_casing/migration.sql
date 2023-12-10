ALTER TABLE "comment" RENAME COLUMN "listId" TO "list_id";
ALTER TABLE "comment" RENAME COLUMN "replyToId" TO "reply_to_id";
ALTER TABLE "comment" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "comment_like" RENAME COLUMN "commentId" TO "comment_id";
ALTER TABLE "comment_like" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "favorite_list" RENAME COLUMN "listId" TO "list_id";
ALTER TABLE "favorite_list" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "film" RENAME COLUMN "filmLength" TO "film_length";
ALTER TABLE "film" RENAME COLUMN "posterPreviewUrl" TO "poster_preview_url";
ALTER TABLE "film" RENAME COLUMN "posterUrl" TO "poster_url";
ALTER TABLE "film_metadata" RENAME COLUMN "filmId" TO "film_id";
ALTER TABLE "list" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "list_like" RENAME COLUMN "listId" TO "list_id";
ALTER TABLE "list_like" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "list_metadata" RENAME COLUMN "listId" TO "list_id";
ALTER TABLE "list_view" RENAME COLUMN "listId" TO "list_id";
ALTER TABLE "list_view" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "review" RENAME COLUMN "listId" TO "list_id";
ALTER TABLE "review" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "to_watch" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "user_metadata" RENAME COLUMN "userId" TO "user_id";


-- Drop existing triggers
DROP TRIGGER IF EXISTS film_metadata_tsvector_update ON film;
DROP TRIGGER IF EXISTS list_metadata_tsvector_update ON list;
DROP TRIGGER IF EXISTS review_metadata_tsvector_update ON review;
DROP TRIGGER IF EXISTS user_metadata_tsvector_update ON "users";

-- Drop existing functions
DROP FUNCTION IF EXISTS update_or_insert_film_metadata_tsvector;
DROP FUNCTION IF EXISTS update_or_insert_list_metadata_tsvector;
DROP FUNCTION IF EXISTS update_or_insert_review_metadata_tsvector;
DROP FUNCTION IF EXISTS update_or_insert_user_metadata_tsvector;


-- Create new functions and triggers
-- Film triggers
CREATE FUNCTION update_or_insert_film_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM film_metadata WHERE film_id = NEW.id) THEN
    UPDATE film_metadata
    SET search_document = to_tsvector('simple', coalesce(NEW.name, ''))
    WHERE film_id = NEW.id;
  ELSE
    INSERT INTO film_metadata (film_id, search_document)
    VALUES (NEW.id, to_tsvector('simple', coalesce(NEW.name, '')));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER film_metadata_tsvector_update AFTER INSERT OR UPDATE
ON film FOR EACH ROW EXECUTE PROCEDURE update_or_insert_film_metadata_tsvector();

-- List triggers
CREATE FUNCTION update_or_insert_list_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM list_metadata WHERE list_id = NEW.id) THEN
    UPDATE list_metadata
    SET search_document = setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B')
    WHERE list_id = NEW.id;
  ELSE
    INSERT INTO list_metadata (list_id, search_document)
    VALUES (NEW.id, setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') || setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER list_metadata_tsvector_update AFTER INSERT OR UPDATE
ON list FOR EACH ROW EXECUTE PROCEDURE update_or_insert_list_metadata_tsvector();

-- Review triggers
CREATE FUNCTION update_or_insert_review_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM review_metadata WHERE review_id = NEW.id) THEN
    UPDATE review_metadata
    SET search_document = to_tsvector('simple', coalesce(NEW.description, ''))
    WHERE review_id = NEW.id;
  ELSE
    INSERT INTO review_metadata (review_id, search_document)
    VALUES (NEW.id, to_tsvector('simple', coalesce(NEW.description, '')));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_metadata_tsvector_update AFTER INSERT OR UPDATE
ON review FOR EACH ROW EXECUTE PROCEDURE update_or_insert_review_metadata_tsvector();

-- User triggers
CREATE FUNCTION update_or_insert_user_metadata_tsvector() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM user_metadata WHERE user_id = NEW.id) THEN
    UPDATE user_metadata
    SET username_search_document = to_tsvector('simple', coalesce(NEW.username, ''))
    WHERE user_id = NEW.id;
  ELSE
    INSERT INTO user_metadata (user_id, username_search_document)
    VALUES (NEW.id, to_tsvector('simple', NEW.username));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_metadata_tsvector_update AFTER INSERT OR UPDATE
ON "public"."users" FOR EACH ROW EXECUTE PROCEDURE update_or_insert_user_metadata_tsvector();
