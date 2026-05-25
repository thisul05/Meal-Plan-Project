-- Seed 005: Tag kids-friendly recipes (age < 13)
-- Criteria: mild flavour, easy to digest, nutritious, not spicy.

-- International kids-friendly recipes
UPDATE recipes SET tags = array_append(tags, 'kids-friendly') WHERE NOT ('kids-friendly' = ANY(tags)) AND name IN (
  'Oatmeal with Berries',
  'Greek Yogurt Parfait',
  'Scrambled Eggs on Wholegrain Toast',
  'Banana Protein Smoothie',
  'Red Lentil Soup',
  'Pasta with Turkey Bolognese',
  'Baked Cod with Sweet Potato Mash',
  'Baked Salmon with Roasted Vegetables',
  'Chicken Stir-Fry with Brown Rice',
  'Cottage Cheese with Pineapple',
  'Apple with Almond Butter',
  'Hummus with Veggie Sticks'
);

-- Sri Lankan kids-friendly recipes (mild, easy to digest)
UPDATE recipes SET tags = array_append(tags, 'kids-friendly') WHERE NOT ('kids-friendly' = ANY(tags)) AND name IN (
  'Kiribath (Milk Rice)',
  'Pittu with Coconut Milk',
  'String Hoppers with Kiri Hodi',
  'Parippu Curry with Pol Roti',
  'Gotukola Mallum with Rice',
  'Mukunuwenna Mallum with Rice',
  'Thala Guli (Sesame Balls)',
  'Pol Pani Pancakes (Pani Pol)'
);
