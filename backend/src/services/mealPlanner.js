const TOLERANCE = 0.10; // ±10%

// Fisher-Yates shuffle — mutates and returns the array.
// Used so each call produces a different meal plan from the same data.
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Returns the slot label for a recipe based on its tags.
function getSlot(tags) {
  if (tags.includes('breakfast')) return 'breakfast';
  if (tags.includes('lunch'))     return 'lunch';
  if (tags.includes('dinner'))    return 'dinner';
  if (tags.includes('snack'))     return 'snack';
  return 'other';
}

// Generates all subsets of snacks with 0, 1, or 2 items.
// With 3 snacks this produces 7 options: [], [s1], [s2], [s3], [s1,s2], [s1,s3], [s2,s3]
function snackSubsets(snacks) {
  const subsets = [[]];
  for (let i = 0; i < snacks.length; i++) {
    subsets.push([snacks[i]]);
    for (let j = i + 1; j < snacks.length; j++) {
      subsets.push([snacks[i], snacks[j]]);
    }
  }
  return subsets;
}

// Formats the chosen meals into the API response shape.
// NUMERIC columns from PostgreSQL come back as strings — parseFloat handles that.
function buildPlan(meals, targetCalories, macros, withinTolerance) {
  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein:  acc.protein  + parseFloat(m.protein),
      carbs:    acc.carbs    + parseFloat(m.carbs),
      fat:      acc.fat      + parseFloat(m.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    meals: meals.map(m => ({
      slot:        getSlot(m.tags),
      id:          m.id,
      name:        m.name,
      calories:    m.calories,
      protein:     parseFloat(m.protein),
      carbs:       parseFloat(m.carbs),
      fat:         parseFloat(m.fat),
      ingredients: m.ingredients,
      steps:       m.steps,
      tags:        m.tags,
    })),
    totals: {
      calories: Math.round(totals.calories),
      protein:  Math.round(totals.protein  * 10) / 10,
      carbs:    Math.round(totals.carbs    * 10) / 10,
      fat:      Math.round(totals.fat      * 10) / 10,
    },
    targets: {
      calories: targetCalories,
      protein:  macros.protein.grams,
      carbs:    macros.carbs.grams,
      fat:      macros.fat.grams,
    },
    withinTolerance,
  };
}

function generateMealPlan(recipes, targetCalories, macros) {
  // Separate recipes into pools by meal slot, shuffle each for variety.
  const pools = {
    breakfast: shuffle(recipes.filter(r => r.tags.includes('breakfast'))),
    lunch:     shuffle(recipes.filter(r => r.tags.includes('lunch'))),
    dinner:    shuffle(recipes.filter(r => r.tags.includes('dinner'))),
    snack:     shuffle(recipes.filter(r => r.tags.includes('snack'))),
  };

  if (!pools.breakfast.length || !pools.lunch.length || !pools.dinner.length) {
    return null;
  }

  const lo = targetCalories * (1 - TOLERANCE);
  const hi = targetCalories * (1 + TOLERANCE);
  const subsets = snackSubsets(pools.snack);

  let bestMeals = null;
  let bestDiff  = Infinity;

  // Try every combination of breakfast × lunch × dinner × snack subset.
  // 5 × 6 × 6 × 7 = 1,260 iterations — runs in < 1ms.
  for (const breakfast of pools.breakfast) {
    for (const lunch of pools.lunch) {
      if (lunch.id === breakfast.id) continue;
      for (const dinner of pools.dinner) {
        if (dinner.id === breakfast.id || dinner.id === lunch.id) continue;
        for (const snacks of subsets) {
          // Skip any snack that duplicates a main meal
          if (snacks.some(s => s.id === breakfast.id || s.id === lunch.id || s.id === dinner.id)) continue;
          const meals = [breakfast, lunch, dinner, ...snacks];
          const total = meals.reduce((sum, m) => sum + m.calories, 0);

          if (total >= lo && total <= hi) {
            // Found a match within tolerance — return immediately.
            return buildPlan(meals, targetCalories, macros, true);
          }

          const diff = Math.abs(total - targetCalories);
          if (diff < bestDiff) {
            bestDiff  = diff;
            bestMeals = meals;
          }
        }
      }
    }
  }

  // No combination hit the target — return the closest match with a warning flag.
  // The controller will pass this through with a note for the frontend to display.
  if (bestMeals) {
    return buildPlan(bestMeals, targetCalories, macros, false);
  }

  return null;
}

module.exports = { generateMealPlan };
