-- Migration 003: saved meal plans
CREATE TABLE IF NOT EXISTS saved_plans (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Store the complete plan response as JSONB so no extra schema is needed
  plan_data  JSONB        NOT NULL,
  calories   INTEGER,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_plans_user_id ON saved_plans (user_id);
