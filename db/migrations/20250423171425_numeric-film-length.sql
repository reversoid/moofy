-- migrate:up

ALTER TABLE films
ALTER COLUMN film_length TYPE INT
USING film_length::integer;


-- migrate:down

ALTER TABLE films
ALTER COLUMN film_length TYPE VARCHAR(6);
