-- Migration 001: create the recipes table
-- Run with: npm run db:migrate

CREATE TABLE IF NOT EXISTS recipes (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL UNIQUE,
  -- JSONB validates JSON at insert time and is stored efficiently as binary.
  -- ingredients and steps are ordered lists, so arrays are the natural shape.
  ingredients JSONB        NOT NULL,
  steps       JSONB        NOT NULL,
  calories    INTEGER      NOT NULL CHECK (calories > 0),
  protein     NUMERIC(5,1) NOT NULL CHECK (protein >= 0),
  carbs       NUMERIC(5,1) NOT NULL CHECK (carbs >= 0),
  fat         NUMERIC(5,1) NOT NULL CHECK (fat >= 0),
  -- TEXT[] is PostgreSQL's native array type — no JSON parsing needed.
  tags        TEXT[]       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- GIN index lets PostgreSQL efficiently answer "does this array contain X?"
-- Used by the meal planner to filter recipes by tag (breakfast, lunch, etc.)
CREATE INDEX IF NOT EXISTS idx_recipes_tags     ON recipes USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_recipes_calories ON recipes (calories);
