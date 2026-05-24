const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

// Maps USDA nutrient IDs to our field names.
// These IDs are stable across the entire USDA database.
const NUTRIENT_MAP = {
  1008: 'calories',  // Energy (kcal)
  1003: 'protein',   // Protein
  1005: 'carbs',     // Carbohydrates
  1004: 'fat',       // Total lipids (fat)
};

// Extracts and normalises the four macros from a USDA food's nutrient array.
// All USDA values are per 100g by default.
function extractMacros(foodNutrients = []) {
  const macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const n of foodNutrients) {
    const field = NUTRIENT_MAP[n.nutrientId];
    if (field) macros[field] = n.value ?? 0;
  }
  return macros;
}

// GET /api/food/search?q=banana
// Proxies to USDA so the API key never touches the browser.
async function searchFood(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'USDA_API_KEY is not configured on the server' });
    }

    const url = new URL(`${USDA_BASE}/foods/search`);
    url.searchParams.set('query', q.trim());
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('pageSize', '12');
    // Foundation + SR Legacy = the highest quality, lab-verified nutritional data
    url.searchParams.set('dataType', 'Foundation,SR Legacy');

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errText = await response.text();
      console.error('USDA API error:', errText);
      return res.status(502).json({ error: 'Food database unavailable. Check your USDA_API_KEY.' });
    }

    const data = await response.json();

    const foods = (data.foods || []).map(food => {
      const macros = extractMacros(food.foodNutrients);
      return {
        fdcId:   food.fdcId,
        name:    food.description,
        brand:   food.brandOwner || null,
        category: food.foodCategory || null,
        // Values are per 100g — the frontend scales them by the user's chosen portion
        per100g: {
          calories: Math.round(macros.calories),
          protein:  Math.round(macros.protein * 10) / 10,
          carbs:    Math.round(macros.carbs   * 10) / 10,
          fat:      Math.round(macros.fat     * 10) / 10,
        },
      };
    });

    res.json(foods);
  } catch (err) {
    next(err);
  }
}

module.exports = { searchFood };
