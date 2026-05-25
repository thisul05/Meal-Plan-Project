-- Seed 006: Fix dinner tags and country values.
-- Dinner should be lighter and easier to digest.
-- array_remove/array_append are safe to run multiple times (idempotent).

-- Fix country for all Sri Lankan recipes (migration UPDATE may not have persisted)
UPDATE recipes SET country = 'Sri Lanka' WHERE name IN (
  'Sri Lankan Rice and Curry',
  'Chicken Kottu Roti',
  'Parippu Curry with Pol Roti',
  'String Hoppers with Kiri Hodi',
  'Egg Hoppers',
  'Fish Ambul Thiyal with Rice',
  'Pittu with Coconut Milk',
  'Kiribath (Milk Rice)',
  'Roti with Lunu Miris',
  'Jackfruit Curry (Polos) with Rice',
  'Devilled Chicken with Fried Rice',
  'Prawn Curry with Rice',
  'Gotukola Mallum with Rice',
  'Mukunuwenna Mallum with Rice',
  'Thala Guli (Sesame Balls)',
  'Kadala Curry (Black Chickpea Curry)',
  'Lamprais',
  'Sri Lankan Chicken Biryani',
  'Hoppers with Egg Curry and Pol Sambol',
  'Pol Pani Pancakes (Pani Pol)',
  'Kokis',
  'Masala Vade'
);

-- Heavy Sri Lankan dishes — lunch only
UPDATE recipes SET tags = array_remove(tags, 'dinner') WHERE name IN (
  'Chicken Kottu Roti',
  'Devilled Chicken with Fried Rice',
  'Sri Lankan Chicken Biryani',
  'Lamprais'
);

-- Ensure the lighter Sri Lankan dishes are properly available for dinner
UPDATE recipes SET tags = array_append(tags, 'dinner')
WHERE NOT ('dinner' = ANY(tags)) AND name IN (
  'Sri Lankan Rice and Curry',
  'Fish Ambul Thiyal with Rice',
  'Prawn Curry with Rice',
  'Jackfruit Curry (Polos) with Rice',
  'Gotukola Mallum with Rice',
  'Mukunuwenna Mallum with Rice'
);

-- Egg and Vegetable Frittata is a great light dinner — add it
UPDATE recipes SET tags = array_append(tags, 'dinner')
WHERE NOT ('dinner' = ANY(tags)) AND name = 'Egg and Vegetable Frittata';
