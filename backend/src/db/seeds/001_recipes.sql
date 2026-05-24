-- Seed 001: 20 sample recipes with verified macro values
-- Calories are computed from macros: (protein × 4) + (carbs × 4) + (fat × 9)
-- ON CONFLICT DO NOTHING makes this safe to run multiple times.

INSERT INTO recipes (name, ingredients, steps, calories, protein, carbs, fat, tags) VALUES

-- ============================================================
-- BREAKFAST  (5 recipes, 300–420 kcal)
-- ============================================================
(
  'Oatmeal with Berries',
  '["80g rolled oats", "240ml semi-skimmed milk", "100g mixed berries", "1 tbsp honey", "1 tsp cinnamon"]',
  '["Bring milk to a gentle simmer.", "Stir in oats and cook 5 minutes until creamy.", "Spoon into a bowl and top with berries, honey, and cinnamon."]',
  340, 12.0, 58.0, 7.0,
  ARRAY['breakfast', 'vegetarian', 'quick']
),
(
  'Greek Yogurt Parfait',
  '["200g plain Greek yogurt (0%)", "40g granola", "80g strawberries", "1 tbsp honey"]',
  '["Layer half the yogurt in a glass.", "Add granola and strawberries.", "Top with remaining yogurt and a drizzle of honey."]',
  300, 18.0, 44.0, 6.0,
  ARRAY['breakfast', 'vegetarian', 'high-protein', 'quick']
),
(
  'Scrambled Eggs on Wholegrain Toast',
  '["3 large eggs", "2 slices wholegrain bread", "1 tsp butter", "salt and pepper to taste"]',
  '["Toast the bread.", "Whisk eggs with salt and pepper.", "Melt butter in a pan over low heat, add eggs, and stir slowly until just set.", "Serve on toast."]',
  350, 22.0, 30.0, 16.0,
  ARRAY['breakfast', 'vegetarian', 'high-protein']
),
(
  'Avocado Toast with Poached Egg',
  '["2 slices sourdough bread", "1 ripe avocado", "2 eggs", "chilli flakes", "lemon juice", "salt"]',
  '["Toast the sourdough.", "Mash avocado with lemon juice and salt.", "Poach eggs in simmering water for 3 minutes.", "Spread avocado on toast, top with eggs and chilli flakes."]',
  380, 16.0, 34.0, 20.0,
  ARRAY['breakfast', 'vegetarian']
),
(
  'Banana Protein Smoothie',
  '["1 large banana", "1 scoop vanilla whey protein (30g)", "240ml semi-skimmed milk", "1 tbsp peanut butter", "4 ice cubes"]',
  '["Add all ingredients to a blender.", "Blend on high for 60 seconds until smooth.", "Serve immediately."]',
  350, 28.0, 38.0, 8.0,
  ARRAY['breakfast', 'high-protein', 'quick']
),

-- ============================================================
-- LUNCH  (6 recipes, 290–470 kcal)
-- ============================================================
(
  'Grilled Chicken Salad',
  '["150g chicken breast", "80g mixed leaves", "1 cucumber", "100g cherry tomatoes", "30g feta cheese", "2 tbsp olive oil dressing"]',
  '["Season chicken and grill 6-7 minutes each side until cooked through.", "Slice chicken and arrange over salad leaves.", "Add vegetables and feta, drizzle with dressing."]',
  370, 42.0, 10.0, 16.0,
  ARRAY['lunch', 'high-protein', 'low-carb']
),
(
  'Tuna Whole Wheat Wrap',
  '["1 large whole wheat tortilla", "120g canned tuna in water", "2 tbsp light mayo", "50g rocket", "1 tomato", "1/4 cucumber"]',
  '["Drain tuna and mix with mayo.", "Lay tortilla flat and add tuna, rocket, tomato, and cucumber.", "Roll tightly, slice in half."]',
  410, 34.0, 40.0, 11.0,
  ARRAY['lunch', 'high-protein', 'quick']
),
(
  'Red Lentil Soup',
  '["200g red lentils", "1 onion", "2 garlic cloves", "1 tin chopped tomatoes", "1 tsp cumin", "1 tsp smoked paprika", "700ml vegetable stock"]',
  '["Sauté onion and garlic in a pot for 5 minutes.", "Add lentils, tomatoes, spices, and stock.", "Simmer 25 minutes until lentils are soft.", "Blend partially for a thicker texture."]',
  290, 16.0, 48.0, 3.0,
  ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'high-fibre']
),
(
  'Quinoa Buddha Bowl',
  '["150g cooked quinoa", "100g roasted chickpeas", "1 avocado", "80g edamame", "50g shredded red cabbage", "2 tbsp tahini dressing"]',
  '["Roast chickpeas at 200°C for 25 minutes.", "Assemble bowl with quinoa as base.", "Add chickpeas, avocado, edamame, and cabbage.", "Drizzle with tahini dressing."]',
  460, 18.0, 52.0, 18.0,
  ARRAY['lunch', 'vegetarian', 'vegan', 'high-fibre']
),
(
  'Turkey and Avocado Sandwich',
  '["2 slices wholegrain bread", "100g sliced turkey breast", "1/2 avocado", "1 tsp Dijon mustard", "1 tomato", "50g spinach"]',
  '["Spread mustard on one slice of bread.", "Layer turkey, avocado slices, tomato, and spinach.", "Top with second slice and press gently."]',
  420, 30.0, 38.0, 16.0,
  ARRAY['lunch', 'high-protein', 'quick']
),
(
  'Egg and Vegetable Frittata',
  '["4 large eggs", "100g baby spinach", "1 red pepper", "1/2 onion", "30g grated cheddar", "1 tsp olive oil"]',
  '["Preheat oven to 180°C.", "Sauté onion and pepper in an oven-safe pan.", "Add spinach until wilted.", "Pour in beaten eggs, top with cheese.", "Bake 15 minutes until set."]',
  310, 24.0, 8.0, 20.0,
  ARRAY['lunch', 'vegetarian', 'high-protein', 'low-carb']
),

-- ============================================================
-- DINNER  (6 recipes, 430–560 kcal)
-- ============================================================
(
  'Baked Salmon with Roasted Vegetables',
  '["180g salmon fillet", "200g broccoli", "150g cherry tomatoes", "1 tbsp olive oil", "lemon juice", "garlic", "salt and pepper"]',
  '["Preheat oven to 200°C.", "Toss vegetables in olive oil, salt, and garlic. Spread on a tray.", "Place salmon on the tray, squeeze lemon over.", "Bake 20 minutes until salmon flakes easily."]',
  440, 40.0, 18.0, 22.0,
  ARRAY['dinner', 'high-protein', 'low-carb', 'dairy-free']
),
(
  'Chicken Stir-Fry with Brown Rice',
  '["150g chicken breast", "150g cooked brown rice", "1 red pepper", "80g broccoli", "2 tbsp soy sauce", "1 tsp sesame oil", "1 garlic clove", "1 tsp ginger"]',
  '["Cook rice according to packet instructions.", "Slice chicken and cook in sesame oil 5-6 minutes.", "Add vegetables, garlic, and ginger. Stir-fry 4 minutes.", "Add soy sauce and toss together. Serve over rice."]',
  460, 36.0, 50.0, 11.0,
  ARRAY['dinner', 'high-protein', 'dairy-free']
),
(
  'Lean Beef and Broccoli',
  '["180g lean beef strips (sirloin)", "200g broccoli florets", "150g cooked jasmine rice", "3 tbsp low-sodium soy sauce", "1 tbsp oyster sauce", "1 tsp cornstarch", "2 garlic cloves"]',
  '["Marinate beef in soy sauce and cornstarch for 10 minutes.", "Cook rice. Blanch broccoli 2 minutes.", "Stir-fry beef in a hot wok 3-4 minutes.", "Add broccoli, garlic, and oyster sauce. Toss well. Serve over rice."]',
  430, 34.0, 42.0, 12.0,
  ARRAY['dinner', 'high-protein', 'dairy-free']
),
(
  'Pasta with Turkey Bolognese',
  '["150g wholemeal spaghetti", "200g lean turkey mince", "1 tin chopped tomatoes", "1 onion", "2 garlic cloves", "1 tbsp olive oil", "mixed Italian herbs"]',
  '["Cook pasta al dente.", "Sauté onion and garlic in olive oil.", "Add turkey mince and brown well.", "Stir in tomatoes and herbs, simmer 20 minutes.", "Toss with drained pasta."]',
  520, 38.0, 62.0, 10.0,
  ARRAY['dinner', 'high-protein', 'dairy-free']
),
(
  'Black Bean Tacos',
  '["2 corn tortillas", "1 tin black beans", "1/2 avocado", "80g shredded red cabbage", "1 lime", "1 tsp cumin", "fresh coriander", "salsa"]',
  '["Warm tortillas in a dry pan.", "Heat black beans with cumin.", "Fill tortillas with beans, cabbage, and avocado.", "Squeeze lime over and top with salsa and coriander."]',
  370, 14.0, 54.0, 10.0,
  ARRAY['dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre']
),
(
  'Baked Cod with Sweet Potato Mash',
  '["180g cod fillet", "250g sweet potato", "100g green beans", "1 tbsp olive oil", "1 tsp paprika", "salt and pepper"]',
  '["Preheat oven to 200°C.", "Bake cod with paprika and olive oil for 18 minutes.", "Boil sweet potato until soft, mash with salt and pepper.", "Steam green beans 4 minutes. Serve together."]',
  390, 36.0, 42.0, 8.0,
  ARRAY['dinner', 'high-protein', 'dairy-free', 'low-fat']
),

-- ============================================================
-- SNACKS  (3 recipes, 140–290 kcal)
-- ============================================================
(
  'Cottage Cheese with Pineapple',
  '["200g low-fat cottage cheese", "100g fresh pineapple chunks", "1 tsp honey"]',
  '["Spoon cottage cheese into a bowl.", "Top with pineapple and a drizzle of honey."]',
  200, 22.0, 22.0, 3.0,
  ARRAY['snack', 'high-protein', 'quick', 'vegetarian']
),
(
  'Apple with Almond Butter',
  '["1 large apple", "2 tbsp almond butter (32g)"]',
  '["Core and slice the apple.", "Serve with almond butter for dipping."]',
  280, 6.0, 32.0, 14.0,
  ARRAY['snack', 'vegetarian', 'vegan', 'quick']
),
(
  'Hummus with Veggie Sticks',
  '["80g hummus", "2 carrots", "1 cucumber", "1 red pepper"]',
  '["Cut vegetables into batons.", "Serve with hummus for dipping."]',
  190, 8.0, 22.0, 8.0,
  ARRAY['snack', 'vegetarian', 'vegan', 'quick', 'high-fibre']
)

ON CONFLICT (name) DO NOTHING;
