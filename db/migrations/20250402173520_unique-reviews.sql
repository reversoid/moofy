-- migrate:up

ALTER TABLE reviews 
ADD CONSTRAINT unique_collection_film UNIQUE (collection_id, film_id);

-- migrate:down

ALTER TABLE reviews
DROP CONSTRAINT unique_collection_film;