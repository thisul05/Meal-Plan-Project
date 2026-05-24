-- Migration 004: food diary logs
-- Macros are denormalized (copied here, not just a recipe FK) so that
-- deleting a recipe never erases a user's history.
CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE         NOT NULL DEFAULT CURRENT_DATE,
  recipe_id  INTEGER      REFERENCES recipes(id) ON DELETE SET NULL,
  meal_slot  VARCHAR(20),
  name       VARCHAR(255) NOT NULL,
  calories   INTEGER      NOT NULL,
  protein    NUMERIC(5,1) NOT NULL DEFAULT 0,
  carbs      NUMERIC(5,1) NOT NULL DEFAULT 0,
  fat        NUMERIC(5,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Most queries are "give me all logs for user X on date Y"
CREATE INDEX IF NOT EXISTS idx_logs_user_date ON logs (user_id, date);
