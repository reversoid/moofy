-- migrate:up

CREATE TABLE user_preferences (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    update_notification_level SMALLINT NOT NULL DEFAULT 2 CHECK (update_notification_level IN (0, 1, 2)),
    PRIMARY KEY (user_id)
);

-- migrate:down

DROP TABLE user_preferences;
