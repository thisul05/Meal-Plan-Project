-- Migration 007: weight tracking
CREATE TABLE IF NOT EXISTS weight_logs (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE         NOT NULL DEFAULT CURRENT_DATE,
  weight_kg  NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs (user_id, date);
