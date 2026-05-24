-- Migration 002: users table
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255),
  email      VARCHAR(255) NOT NULL UNIQUE,
  -- bcrypt hash, never the plain-text password
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
