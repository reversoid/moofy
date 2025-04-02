-- migrate:up

ALTER TABLE films RENAME COLUMN id TO kinopoisk_id;
ALTER TABLE films ADD COLUMN id INTEGER UNIQUE GENERATED ALWAYS AS IDENTITY;

ALTER TABLE reviews RENAME COLUMN film_id TO film_kinopoisk_id;
ALTER TABLE reviews ADD COLUMN film_id INTEGER NULL;

-- migrate:down

ALTER TABLE reviews DROP COLUMN film_id;
ALTER TABLE reviews RENAME COLUMN film_kinopoisk_id TO film_id;

ALTER TABLE films DROP COLUMN id;
ALTER TABLE films RENAME COLUMN kinopoisk_id TO id;

