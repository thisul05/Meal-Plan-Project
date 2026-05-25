-- Seed 007: Redesign Sri Lankan main meals as complete rice-and-curry plates.
-- A realistic Sri Lankan meal = rice + main curry + parippu + pol sambol + vegetable.
-- All calorie values verified: (protein × 4) + (carbs × 4) + (fat × 9)

-- ── Fish Ambul Thiyal Complete Plate ─────────────────────────────────────────
UPDATE recipes SET
  name        = 'Rice with Fish Ambul Thiyal, Parippu & Sambol',
  ingredients = '["160g steamed white rice", "130g seer fish (for ambul thiyal)", "3 pieces goraka (gamboge)", "1 tsp black pepper", "1 tsp turmeric", "2 garlic cloves", "80g red lentils (for parippu)", "100ml coconut milk (for parippu)", "1 small onion", "1 tsp mustard seeds", "1 sprig curry leaves", "25g freshly grated coconut (for pol sambol)", "1 dried red chilli", "1 shallot", "lime juice", "60g pumpkin or ash plantain (for vegetable curry)", "salt to taste"]',
  steps       = '["Cook rice and set aside covered.", "Ambul Thiyal: Soak goraka in warm water, grind to paste. Coat fish with goraka, pepper, turmeric, garlic, and salt. Cook in clay pot on low heat 20 minutes until dry-roasted.", "Parippu: Boil lentils until soft. In a pan temper mustard seeds, curry leaves, and onion. Add lentils and coconut milk. Simmer 8 minutes until thick. Season with salt.", "Pol Sambol: Grind grated coconut, dried chilli, shallot, salt, and lime into a coarse paste.", "Vegetable: Cook pumpkin or ash plantain with turmeric, onion, and a splash of coconut milk until tender.", "Serve rice on a plate with fish ambul thiyal, parippu, pol sambol, and vegetable arranged alongside."]',
  calories    = 570, protein = 39, carbs = 70, fat = 15,
  tags        = ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free']
WHERE name = 'Fish Ambul Thiyal with Rice';

-- ── Prawn Curry Complete Plate ────────────────────────────────────────────────
UPDATE recipes SET
  name        = 'Rice with Prawn Curry, Parippu & Pol Sambol',
  ingredients = '["160g steamed white rice", "180g raw tiger prawns (peeled and deveined)", "1 onion (sliced)", "3 garlic cloves", "1 tsp ginger (grated)", "80ml coconut milk", "1 tin (200g) chopped tomatoes", "1½ tsp Sri Lankan roasted curry powder", "1 tsp turmeric", "1 sprig curry leaves", "80g red lentils (for parippu)", "80ml thin coconut milk (for parippu)", "25g freshly grated coconut (for pol sambol)", "1 dried red chilli", "1 shallot", "lime juice", "1 tbsp oil", "salt to taste"]',
  steps       = '["Cook rice and set aside covered.", "Prawn Curry: Heat oil, fry curry leaves. Add onion, garlic, ginger — sauté until golden. Stir in curry powder and turmeric. Add tomatoes, simmer 8 minutes. Add prawns and coconut milk. Cook 4–5 minutes gently — do not boil.", "Parippu: Boil lentils. Temper mustard seeds, onion, curry leaves. Add lentils and thin coconut milk. Simmer until thick. Season.", "Pol Sambol: Grind grated coconut, dried chilli, shallot, salt, and lime to a coarse paste.", "Serve rice with prawn curry, parippu, and pol sambol arranged alongside."]',
  calories    = 510, protein = 28, carbs = 64, fat = 16,
  tags        = ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free']
WHERE name = 'Prawn Curry with Rice';

-- ── Jackfruit (Polos) Complete Plate ─────────────────────────────────────────
UPDATE recipes SET
  name        = 'Rice with Jackfruit Curry, Parippu & Pol Sambol',
  ingredients = '["160g steamed white rice", "300g young green jackfruit (tinned)", "1 onion (sliced)", "3 garlic cloves", "60ml thick coconut milk", "2 tsp roasted curry powder", "1 tsp turmeric", "1 sprig curry leaves", "1 tsp mustard seeds", "80g red lentils (for parippu)", "80ml coconut milk (for parippu)", "25g freshly grated coconut (for pol sambol)", "1 dried red chilli", "1 shallot", "lime juice", "60g ash plantain or pumpkin (for vegetable)", "1 tbsp oil", "salt to taste"]',
  steps       = '["Cook rice and set aside covered.", "Jackfruit Curry: Drain jackfruit. Heat oil, temper mustard seeds and curry leaves. Add onion and garlic — sauté until golden. Add jackfruit, turmeric, curry powder. Pour in coconut milk, simmer 20–25 minutes until tender.", "Parippu: Boil lentils. Temper onion and curry leaves. Add lentils and coconut milk. Simmer until thick. Season.", "Pol Sambol: Grind grated coconut, chilli, shallot, salt, and lime into a coarse paste.", "Vegetable: Cook ash plantain with turmeric and a little coconut milk until soft.", "Serve rice with all curries and sambol arranged alongside."]',
  calories    = 520, protein = 12, carbs = 80, fat = 16,
  tags        = ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre']
WHERE name = 'Jackfruit Curry (Polos) with Rice';

-- ── Gotukola Mallum Complete Plate ───────────────────────────────────────────
UPDATE recipes SET
  name        = 'Rice with Gotukola Mallum, Parippu & Sambol',
  ingredients = '["180g steamed white rice", "100g gotukola (gotu kola), finely shredded", "50g freshly grated coconut", "1 shallot (sliced)", "1 green chilli", "1 tsp lime juice", "pinch of turmeric", "80g red lentils (for parippu)", "80ml coconut milk (for parippu)", "1 tsp mustard seeds", "1 sprig curry leaves", "20g freshly grated coconut (for pol sambol)", "1 dried red chilli", "salt to taste"]',
  steps       = '["Cook rice and set aside covered.", "Gotukola Mallum: Shred gotukola finely. Mix with grated coconut, shallot, green chilli, turmeric, and salt. Toss in a dry pan 2–3 minutes until wilted. Finish with lime juice.", "Parippu: Boil lentils until soft. Temper mustard seeds, curry leaves, and onion. Add lentils and coconut milk. Simmer until creamy. Season with salt.", "Pol Sambol: Grind coconut, dried chilli, a pinch of salt, and lime into a coarse paste.", "Serve rice with gotukola mallum, parippu, and pol sambol arranged alongside."]',
  calories    = 500, protein = 13, carbs = 76, fat = 16,
  tags        = ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre']
WHERE name = 'Gotukola Mallum with Rice';

-- ── Mukunuwenna Mallum Complete Plate ────────────────────────────────────────
UPDATE recipes SET
  name        = 'Rice with Mukunuwenna Mallum, Parippu & Sambol',
  ingredients = '["180g steamed white rice", "120g mukunuwenna (Alternanthera sessilis), picked and washed", "45g freshly grated coconut", "1 shallot (sliced)", "1 green chilli", "1 tsp lime juice", "pinch of turmeric", "80g red lentils (for parippu)", "80ml coconut milk (for parippu)", "1 tsp mustard seeds", "1 sprig curry leaves", "20g freshly grated coconut (for pol sambol)", "1 dried red chilli", "1 tsp oil", "salt to taste"]',
  steps       = '["Cook rice and set aside covered.", "Mukunuwenna Mallum: Blanch mukunuwenna in boiling salted water 30 seconds, drain and squeeze. Roughly chop. Heat oil, temper shallot and chilli. Add mukunuwenna, grated coconut, turmeric, and salt. Toss 2–3 minutes. Finish with lime.", "Parippu: Boil lentils until soft. Temper mustard seeds and curry leaves. Add lentils and coconut milk. Simmer until creamy. Season.", "Pol Sambol: Grind coconut, dried chilli, salt, and lime into a coarse paste.", "Serve rice with mukunuwenna mallum, parippu, and pol sambol alongside."]',
  calories    = 490, protein = 14, carbs = 74, fat = 15,
  tags        = ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre']
WHERE name = 'Mukunuwenna Mallum with Rice';

-- ── New: Chicken Curry Complete Plate ────────────────────────────────────────
INSERT INTO recipes (name, ingredients, steps, calories, protein, carbs, fat, tags, country) VALUES
(
  'Rice with Chicken Curry, Parippu & Sambol',
  '["160g steamed white rice", "130g chicken thighs (bone-in, skinless)", "1 onion (sliced)", "3 garlic cloves", "1 tsp ginger (grated)", "80ml thick coconut milk", "1½ tsp Sri Lankan roasted curry powder", "1 tsp turmeric", "1 sprig curry leaves", "2 dried red chillies", "80g red lentils (for parippu)", "80ml thin coconut milk (for parippu)", "25g freshly grated coconut (for pol sambol)", "1 shallot", "1 dried red chilli (for sambol)", "lime juice", "60g pumpkin (for vegetable curry)", "1 tbsp oil", "salt to taste"]',
  '["Cook rice and set aside covered.", "Chicken Curry: Heat oil, fry curry leaves and dried chillies. Add onion, garlic, ginger — sauté until golden. Add curry powder and turmeric, cook 30 seconds. Add chicken, stir to coat. Pour in coconut milk and a splash of water. Cover and simmer 25–30 minutes until chicken is tender and sauce thickens.", "Parippu: Boil lentils until soft. Temper mustard seeds, curry leaves, onion. Add lentils and thin coconut milk. Simmer until thick. Season.", "Pol Sambol: Grind grated coconut, dried chilli, shallot, salt, and lime into a coarse paste.", "Pumpkin Curry: Cook pumpkin cubes with turmeric, onion, and a splash of coconut milk until soft.", "Serve rice on a plate with chicken curry, parippu, pol sambol, and pumpkin curry alongside."]',
  580, 34, 70, 18,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free'],
  'Sri Lanka'
)
ON CONFLICT (name) DO NOTHING;
