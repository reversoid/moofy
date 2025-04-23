-- migrate:up

ALTER TABLE reviews ADD COLUMN reverse_position SERIAL;
ALTER TABLE collections ADD COLUMN reverse_position SERIAL;


-- migrate:down

ALTER TABLE reviews DROP COLUMN reverse_position;
ALTER TABLE collections DROP COLUMN reverse_position;

