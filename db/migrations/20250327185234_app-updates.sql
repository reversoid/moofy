-- migrate:up

CREATE TABLE user_app_update_views (
    user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

-- migrate:down

DROP TABLE user_app_update_views;
