-- Seed 002: Sri Lankan recipes
-- Calories verified: (protein × 4) + (carbs × 4) + (fat × 9)

INSERT INTO recipes (name, ingredients, steps, calories, protein, carbs, fat, tags) VALUES

(
  'Sri Lankan Rice and Curry',
  '["180g cooked white rice", "100g dhal curry", "30g coconut sambol", "80g vegetable curry (e.g. beetroot or ash plantain)", "salt to taste"]',
  '["Cook rice until fluffy and set aside.", "Prepare dhal by simmering red lentils with turmeric, garlic, and tempered mustard seeds.", "Make coconut sambol by mixing fresh coconut, chilli, onion, and lime.", "Serve rice with all sides arranged around it."]',
  470, 14.0, 82.0, 10.0,
  ARRAY['lunch', 'dinner', 'vegetarian', 'dairy-free', 'high-fibre']
),

(
  'Chicken Kottu Roti',
  '["2 plain rotis (shredded)", "120g chicken breast (cooked and shredded)", "1 egg", "1 onion", "1 green chilli", "1 carrot (grated)", "2 tbsp soy sauce", "1 tsp black pepper", "1 tsp oil"]',
  '["Heat oil in a flat griddle or large pan over high heat.", "Sauté onion and chilli until soft.", "Add shredded roti and press repeatedly with a spatula to chop into small pieces.", "Push roti aside, scramble the egg, then mix everything together.", "Add chicken, carrot, soy sauce, and pepper. Toss well and cook 3-4 more minutes."]',
  570, 42.0, 64.0, 16.0,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free']
),

(
  'Parippu Curry with Pol Roti',
  '["150g cooked red lentils (parippu)", "1/2 onion", "1 tomato", "100ml coconut milk", "1 tsp turmeric", "1 tsp cumin", "2 pol roti (coconut flatbread)", "40g fresh coconut (grated)", "1 green chilli"]',
  '["Cook lentils until soft. In a pan, temper mustard seeds, onion, and tomato.", "Add lentils, coconut milk, turmeric, and cumin. Simmer 10 minutes.", "For pol roti, mix flour, grated coconut, and chilli into a dough. Shape and cook on a dry pan 3 minutes each side.", "Serve parippu alongside warm pol roti."]',
  400, 15.0, 56.0, 13.0,
  ARRAY['breakfast', 'lunch', 'vegetarian', 'high-fibre']
),

(
  'String Hoppers with Kiri Hodi',
  '["6 steamed string hoppers (indi appa)", "150ml coconut milk", "1/2 onion", "1 green chilli", "1 sprig curry leaves", "1 tsp turmeric", "salt to taste"]',
  '["Steam string hopper flour pressed through a mould for 8-10 minutes until set.", "For kiri hodi, temper mustard seeds, curry leaves, onion, and chilli in a pan.", "Add coconut milk and turmeric. Simmer gently on low heat — do not boil.", "Season with salt and serve poured over string hoppers."]',
  370, 7.0, 68.0, 8.0,
  ARRAY['breakfast', 'vegetarian', 'dairy-free']
),

(
  'Egg Hoppers',
  '["2 cups rice flour", "1 cup coconut milk", "1/2 tsp instant yeast", "1/2 tsp sugar", "2 eggs", "salt to taste", "oil for greasing"]',
  '["Mix rice flour, coconut milk, yeast, sugar, and salt. Rest batter 1 hour.", "Heat a small hopper pan and grease lightly.", "Pour a ladle of batter and swirl to coat the sides. Crack one egg into the centre.", "Cover and cook 3-4 minutes until edges are crisp and egg is just set.", "Repeat for second hopper."]',
  280, 12.0, 36.0, 10.0,
  ARRAY['breakfast', 'vegetarian', 'dairy-free']
),

(
  'Fish Ambul Thiyal with Rice',
  '["180g seer fish (wahoo) cut into chunks", "4 pieces goraka (gamboge)", "180g cooked white rice", "1 tsp black pepper", "1 tsp turmeric", "2 garlic cloves", "1 sprig curry leaves", "salt to taste"]',
  '["Soak goraka in warm water 10 minutes, then grind to a paste.", "Coat fish with goraka paste, pepper, turmeric, garlic, and salt.", "Cook in a clay pot or heavy pan over low heat with a splash of water.", "Stir occasionally until liquid is absorbed and fish is dry-roasted (about 20 minutes).", "Serve with steamed rice."]',
  430, 40.0, 58.0, 4.0,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free', 'low-fat']
)

ON CONFLICT (name) DO NOTHING;
