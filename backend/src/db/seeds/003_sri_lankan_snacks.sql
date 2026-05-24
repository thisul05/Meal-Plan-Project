-- Seed 003: Sri Lankan snack recipes
-- Needed so country-filtered meal plans can fill the snack slot.

INSERT INTO recipes (name, ingredients, steps, calories, protein, carbs, fat, tags, country) VALUES

(
  'Kokis',
  '["120g rice flour", "80ml thick coconut milk", "1 egg", "1/4 tsp turmeric", "1/4 tsp salt", "oil for deep frying"]',
  '["Mix rice flour, coconut milk, egg, turmeric, and salt into a smooth batter (consistency of thick cream).", "Heat oil in a deep pan to 175°C.", "Dip the kokis mould into hot oil for 30 seconds to heat it, then into the batter so it coats the mould (do not submerge the top).", "Lower back into the oil — the kokis will release after 10-15 seconds.", "Fry 2-3 minutes until golden and crisp. Drain on paper towels."]',
  240, 4.0, 30.0, 12.0,
  ARRAY['snack', 'vegetarian', 'dairy-free'],
  'Sri Lanka'
),

(
  'Masala Vade',
  '["150g chana dal (split chickpeas)", "1 small onion (finely chopped)", "2 green chillies (finely chopped)", "1 sprig curry leaves (chopped)", "1 tsp fennel seeds", "1/2 tsp black pepper", "salt to taste", "oil for deep frying"]',
  '["Soak chana dal in water for 3 hours, then drain well.", "Reserve 2 tbsp whole dal. Grind the rest coarsely — do not add water.", "Mix ground dal with whole dal, onion, chillies, curry leaves, fennel, pepper, and salt.", "Shape into small flat patties (about 5cm wide).", "Deep fry in hot oil (170°C) for 3-4 minutes each side until dark golden. Drain and serve hot."]',
  210, 9.0, 24.0, 9.0,
  ARRAY['snack', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre'],
  'Sri Lanka'
)

ON CONFLICT (name) DO NOTHING;
