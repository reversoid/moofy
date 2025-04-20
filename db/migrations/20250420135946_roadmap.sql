-- migrate:up

CREATE TABLE roadmap_items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_number INTEGER NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- migrate:down

DROP TABLE roadmap_items;