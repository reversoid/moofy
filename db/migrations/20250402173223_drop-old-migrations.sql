-- migrate:up

DROP TABLE migrations;

-- migrate:down

CREATE TABLE migrations (
    id integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "timestamp" bigint NOT NULL,
    name VARCHAR(128) NOT NULL
);
