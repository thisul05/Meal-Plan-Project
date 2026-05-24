-- Seed 004: Additional nutritious Sri Lankan recipes
-- All calorie values verified: (protein × 4) + (carbs × 4) + (fat × 9)
-- Covers all meal slots to improve country-filtered meal plan variety.

INSERT INTO recipes (name, ingredients, steps, calories, protein, carbs, fat, tags, country) VALUES

-- ============================================================
-- BREAKFAST  (+3 options)
-- ============================================================
(
  'Pittu with Coconut Milk',
  '["120g rice flour", "50g freshly grated coconut", "pinch of salt", "water to bind", "150ml thin coconut milk (for serving)", "1 ripe banana (optional, for serving)"]',
  '["Mix rice flour, grated coconut, and salt. Sprinkle water gradually and rub between fingers until the mixture resembles damp breadcrumbs (not a paste).", "Press mixture into a cylindrical pittu mould, alternating layers of flour mixture and grated coconut.", "Steam over boiling water for 10–12 minutes until firm.", "Slide pittu out and serve warm with coconut milk poured over and a banana on the side."]',
  360, 6, 62, 10,
  ARRAY['breakfast', 'vegetarian', 'dairy-free', 'gluten-free'],
  'Sri Lanka'
),

(
  'Kiribath (Milk Rice)',
  '["200g raw white rice", "400ml thick coconut milk", "200ml water", "1 tsp salt", "lunu miris (onion chilli sambol) for serving"]',
  '["Wash rice and bring to a boil with water and a pinch of salt. Cook on medium heat until water is almost absorbed.", "Pour in the coconut milk, stir gently, and reduce heat to very low.", "Cover and cook 15–18 minutes until coconut milk is fully absorbed and rice is soft and sticky.", "Spread onto a flat plate greased with coconut oil, press flat to about 2 cm thick.", "Allow to cool for 5 minutes, then cut into diamond shapes. Serve with lunu miris."]',
  410, 7, 72, 11,
  ARRAY['breakfast', 'vegetarian', 'dairy-free', 'gluten-free'],
  'Sri Lanka'
),

(
  'Roti with Lunu Miris',
  '["200g whole wheat flour", "40g freshly grated coconut", "1 green chilli (finely chopped)", "water to knead", "1 tsp salt", "1 tbsp oil for cooking", "lunu miris: 2 shallots, 2 dried red chillies, salt, lime juice"]',
  '["Mix flour, grated coconut, chilli, and salt. Add water gradually and knead into a smooth, slightly firm dough. Rest 10 minutes.", "Divide into 4 equal balls. Roll each to a thin circle (about 20 cm diameter).", "Cook on a lightly oiled flat pan over medium heat, 2–3 minutes each side until lightly golden with brown spots.", "For lunu miris: grind shallots, dried chillies, salt, and a squeeze of lime into a rough paste. Serve as a dip alongside roti."]',
  340, 10, 54, 9,
  ARRAY['breakfast', 'vegetarian'],
  'Sri Lanka'
),

-- ============================================================
-- LUNCH / DINNER  (+5 dishes)
-- ============================================================
(
  'Jackfruit Curry (Polos) with Rice',
  '["400g young green jackfruit (tinned or fresh, cut into chunks)", "160g cooked white rice", "1 onion (sliced)", "3 garlic cloves", "1 tsp ginger (grated)", "60ml thick coconut milk", "1 tsp turmeric", "2 tsp roasted curry powder", "1 sprig curry leaves", "1 tsp mustard seeds", "1 tbsp oil", "salt to taste"]',
  '["Drain jackfruit well. If fresh, parboil in salted water 15 minutes; drain.", "Heat oil, temper mustard seeds and curry leaves until fragrant.", "Add onion, garlic, and ginger; sauté until golden.", "Add jackfruit chunks, turmeric, and curry powder. Stir to coat.", "Pour in coconut milk with a splash of water. Simmer 20–25 minutes until jackfruit is tender and sauce thickens.", "Season with salt and serve over steamed rice."]',
  480, 8, 75, 17,
  ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre'],
  'Sri Lanka'
),

(
  'Devilled Chicken with Fried Rice',
  '["150g chicken breast (cut into bite-size pieces)", "150g cooked jasmine rice", "1 egg", "1 onion (roughly chopped)", "1 red and 1 green pepper (sliced)", "2 tomatoes (quartered)", "2 tbsp tomato ketchup", "1 tbsp soy sauce", "1 tsp chilli flakes", "1 tsp black pepper", "1 tsp sugar", "2 tsp oil", "salt to taste"]',
  '["Season chicken with pepper and salt. Fry in hot oil 5–6 minutes until cooked and edges are slightly caramelised. Set aside.", "In the same pan, scramble the egg with a little oil, then add rice and soy sauce. Toss together 2 minutes. Set aside.", "Add a little more oil, fry onion and peppers 3 minutes. Add tomatoes.", "Return chicken to pan. Add ketchup, soy sauce, sugar, and chilli flakes. Toss well on high heat 3–4 minutes until glossy and slightly charred at the edges.", "Serve devilled chicken over the fried rice."]',
  530, 39, 62, 14,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free'],
  'Sri Lanka'
),

(
  'Prawn Curry with Rice',
  '["200g raw tiger prawns (peeled and deveined)", "160g cooked white rice", "1 onion (finely sliced)", "3 garlic cloves (minced)", "1 tsp ginger (grated)", "50ml thick coconut milk", "1 tin (200g) chopped tomatoes", "1 tsp turmeric", "1½ tsp Sri Lankan roasted curry powder", "1 sprig curry leaves", "1 tbsp oil", "salt to taste"]',
  '["Heat oil, fry curry leaves until they splutter. Add onion; sauté 5 minutes until golden.", "Add garlic and ginger; cook 1 minute.", "Stir in turmeric and curry powder; cook 30 seconds.", "Add chopped tomatoes and simmer 8 minutes until sauce thickens.", "Add prawns and coconut milk. Simmer gently 4–5 minutes — do not boil or prawns become rubbery.", "Season with salt. Serve over steamed white rice."]',
  470, 29, 54, 15,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free'],
  'Sri Lanka'
),

(
  'Gotukola Mallum with Rice',
  '["100g gotukola (gotu kola / Asiatic pennywort), finely shredded", "50g freshly grated coconut", "1 shallot (finely sliced)", "1 green chilli (finely chopped)", "1 tsp lime juice", "pinch of turmeric", "salt to taste", "200g cooked white rice"]',
  '["Wash gotukola thoroughly and shred very finely (chiffonade).", "Mix shredded gotukola with grated coconut, shallot, green chilli, turmeric, and salt.", "Heat a dry pan on medium. Add the gotukola mixture and toss for 2–3 minutes just to wilt the leaves — do not overcook.", "Squeeze lime juice over and mix.", "Serve alongside steamed white rice with a dhal curry or other side dishes."]',
  460, 10, 73, 14,
  ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre'],
  'Sri Lanka'
),

(
  'Mukunuwenna Mallum with Rice',
  '["120g mukunuwenna (Alternanthera sessilis / water cress), picked and washed", "45g freshly grated coconut", "1 shallot (sliced)", "1 green chilli", "1 tsp lime juice", "pinch of turmeric", "salt to taste", "200g cooked white rice", "1 tsp oil"]',
  '["Blanch mukunuwenna in boiling salted water for 30 seconds. Drain and squeeze out excess water. Roughly chop.", "Heat oil in a pan. Temper shallot and green chilli 1 minute.", "Add mukunuwenna, grated coconut, turmeric, and salt. Toss together over low heat 2–3 minutes.", "Finish with a squeeze of lime juice.", "Serve warm with steamed white rice as part of a rice and curry meal."]',
  450, 11, 71, 13,
  ARRAY['lunch', 'dinner', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre'],
  'Sri Lanka'
),

-- ============================================================
-- SNACKS  (+2 options)
-- ============================================================
(
  'Thala Guli (Sesame Balls)',
  '["100g white sesame seeds", "60g kithul jaggery (or dark brown sugar)", "30g freshly grated coconut", "1 tbsp water"]',
  '["Dry roast sesame seeds in a pan over medium heat, stirring constantly, for 3–4 minutes until golden and fragrant. Pour onto a plate to cool.", "Grate or finely chop the jaggery.", "In a heavy pan, melt jaggery with 1 tbsp water on low heat. Do not stir — swirl the pan gently.", "When jaggery starts to thicken (soft ball stage, about 115°C), remove from heat.", "Quickly mix in sesame seeds and grated coconut. Work fast before it sets.", "Wet hands slightly and roll into small balls (about 3 cm). Set on parchment to cool and harden."]',
  190, 5, 18, 11,
  ARRAY['snack', 'vegetarian', 'vegan', 'dairy-free', 'gluten-free'],
  'Sri Lanka'
),

(
  'Kadala Curry (Black Chickpea Curry)',
  '["150g cooked black chickpeas (kadala)", "30ml thick coconut milk", "1 small onion (sliced)", "2 garlic cloves", "1 sprig curry leaves", "1 tsp roasted curry powder", "½ tsp turmeric", "½ tsp chilli powder", "1 tsp oil", "salt to taste"]',
  '["Heat oil. Temper curry leaves, then add onion and garlic. Sauté 4 minutes until golden.", "Add turmeric, curry powder, and chilli powder. Cook 30 seconds.", "Add cooked chickpeas and stir to coat with spices.", "Pour in coconut milk and a splash of water. Simmer 8–10 minutes until sauce coats the chickpeas.", "Season with salt. Serve hot as a snack or light meal — pairs well with a roti or bread roll."]',
  220, 8, 26, 9,
  ARRAY['snack', 'vegetarian', 'vegan', 'dairy-free', 'high-fibre', 'high-protein'],
  'Sri Lanka'
),

-- ============================================================
-- HIGH-CALORIE OPTIONS  (+4 dishes to raise the plan ceiling)
-- These ensure higher-calorie targets (active males, bulking)
-- can be matched within ±10% tolerance on Sri Lankan plans.
-- ============================================================
(
  'Lamprais',
  '["180g par-boiled white rice", "120g chicken curry (bone-in, rich coconut gravy)", "2 frikkadels (spiced beef/pork meatballs, 40g each)", "40g brinjal pahi (pickled eggplant)", "30g coconut pol sambol", "1 banana leaf for wrapping", "salt and mixed spices to taste"]',
  '["Parboil rice in seasoned stock until 80% cooked. Drain.", "Prepare or reheat chicken curry, frikkadels, brinjal pahi, and pol sambol as separate sides.", "Lay a banana leaf flat and soften briefly over a flame so it does not crack.", "Scoop rice into the centre. Arrange all sides around the rice in neat portions.", "Fold the banana leaf into a tight parcel and pin with toothpicks or tie with string.", "Bake the parcels in an oven at 180°C for 25–30 minutes.", "Serve the parcel whole — the banana leaf infuses a subtle aroma into the rice."]',
  700, 35, 76, 28,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free'],
  'Sri Lanka'
),

(
  'Sri Lankan Chicken Biryani',
  '["180g basmati rice", "160g chicken thighs (bone-in, skin removed)", "1 large onion (thinly sliced)", "2 tbsp plain yogurt", "1 tbsp ghee", "2 garlic cloves", "1 tsp ginger (grated)", "1 tsp turmeric", "1½ tsp Sri Lankan biryani spice mix", "1 tsp chilli powder", "handful mint leaves", "saffron in 2 tbsp warm milk", "salt to taste"]',
  '["Marinate chicken in yogurt, garlic, ginger, turmeric, chilli, and biryani spice for at least 30 minutes.", "Par-boil rice with salt and whole spices until 70% cooked. Drain.", "Fry sliced onion in ghee until deep golden and crispy. Set aside.", "In a heavy pot, layer: chicken marinade → half the rice → mint → fried onions → remaining rice → saffron milk.", "Seal the pot tightly with foil and then the lid. Cook on very low heat (dum) for 30–35 minutes.", "Gently mix from the bottom before serving."]',
  560, 40, 64, 15,
  ARRAY['lunch', 'dinner', 'high-protein', 'dairy-free'],
  'Sri Lanka'
),

(
  'Hoppers with Egg Curry and Pol Sambol',
  '["3 plain hoppers (rice flour and coconut milk batter)", "2 eggs (for egg curry)", "80ml coconut milk", "1 small onion", "curry leaves, turmeric, chilli", "pol sambol: 40g grated coconut, 1 shallot, 1 dried chilli, lime juice, salt"]',
  '["Prepare hopper batter: mix rice flour, coconut milk, yeast, and salt. Ferment 4–6 hours or overnight.", "Make egg curry: hard-boil eggs. Temper onion, curry leaves, and spices in a pan. Add coconut milk and halved eggs; simmer 10 minutes.", "For pol sambol: grind grated coconut, shallot, dried chilli, salt, and lime juice into a coarse, slightly moist mix.", "Cook hoppers: heat a small hopper pan and grease lightly. Swirl batter to coat edges. Cover and cook 3–4 minutes until edges are crisp and bottom is cooked.", "Serve 3 hoppers alongside the egg curry and pol sambol."]',
  500, 20, 56, 21,
  ARRAY['breakfast', 'vegetarian', 'dairy-free', 'high-protein'],
  'Sri Lanka'
),

(
  'Pol Pani Pancakes (Pani Pol)',
  '["150g plain flour", "1 egg", "200ml coconut milk", "pinch of salt", "1 tsp oil (for pan)", "filling: 80g freshly grated coconut", "50g kithul treacle or dark jaggery", "¼ tsp cardamom powder"]',
  '["Make filling: combine grated coconut with jaggery/treacle and cardamom in a pan. Cook on low heat 5 minutes, stirring, until mixture holds together. Allow to cool.", "Make batter: whisk flour, egg, coconut milk, and salt until smooth. Rest 10 minutes.", "Heat a non-stick pan with a tiny amount of oil. Pour a ladleful of batter and swirl thin.", "Cook 1–2 minutes until top is set, then flip briefly for 30 seconds.", "Place a tablespoon of coconut filling in the centre of each pancake. Fold or roll. Serve warm."]',
  300, 5, 50, 9,
  ARRAY['snack', 'vegetarian', 'dairy-free'],
  'Sri Lanka'
)

ON CONFLICT (name) DO NOTHING;
