const pool = require('../config/db');
const { generateMealPlan } = require('../services/mealPlanner');

// POST /api/mealplan/generate
// Body: { targetCalories: number, macros: { protein, fat, carbs } }
async function generate(req, res, next) {
  try {
    const { targetCalories, macros, country, age } = req.body;

    if (!targetCalories || !macros) {
      return res.status(400).json({ error: 'targetCalories and macros are required' });
    }

    if (typeof targetCalories !== 'number' || targetCalories < 500) {
      return res.status(400).json({ error: 'targetCalories must be a number of at least 500' });
    }

    const isKids = typeof age === 'number' && age < 13;
    const selectedCountry = (country && country !== 'all') ? country : 'International';

    let query, params;
    if (isKids) {
      query  = `SELECT * FROM recipes WHERE country = $1 AND 'kids-friendly' = ANY(tags)`;
      params = [selectedCountry];
    } else {
      query  = `SELECT * FROM recipes WHERE country = $1`;
      params = [selectedCountry];
    }

    const recipesResult = await pool.query(query, params);
    const recipes = recipesResult.rows;

    const plan = generateMealPlan(recipes, targetCalories, macros);

    // null means the recipe pool had empty slots — shouldn't happen with a seeded DB.
    if (!plan) {
      return res.status(422).json({
        error: 'Could not build a meal plan. Ensure the recipe database is seeded.',
      });
    }

    // withinTolerance: false means we found the closest match but it missed the ±10% window.
    // We still return 200 — the frontend shows a note rather than a hard error.
    if (!plan.withinTolerance) {
      return res.json({
        ...plan,
        warning: `No combination of recipes hit your ${targetCalories} kcal target within ±10%. This is the closest plan available — consider adding more recipes to the database.`,
      });
    }

    res.json(plan);
  } catch (err) {
    next(err);
  }
}

module.exports = { generate };
