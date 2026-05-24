ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'International';

-- Tag the six Sri Lankan dishes already in the database
UPDATE recipes SET country = 'Sri Lanka' WHERE name IN (
  'Sri Lankan Rice and Curry',
  'Chicken Kottu Roti',
  'Parippu Curry with Pol Roti',
  'String Hoppers with Kiri Hodi',
  'Egg Hoppers',
  'Fish Ambul Thiyal with Rice'
);
