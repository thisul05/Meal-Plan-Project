// --- BMR (Mifflin-St Jeor) ---
// Returns kcal/day at complete rest.
// weight in kg, height in cm, age in years.
function calculateBMR(age, weight, height, sex) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

// --- TDEE ---
// Multiplies BMR by an activity factor.
const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function calculateTDEE(bmr, activityLevel) {
  const factor = ACTIVITY_FACTORS[activityLevel];
  if (!factor) throw new Error(`Unknown activity level: ${activityLevel}`);
  return bmr * factor;
}

// --- BMI ---
// weight in kg, height in cm.
function calculateBMI(weight, height) {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

// --- Calorie target ---
// Safe floors: 1500 kcal men, 1200 kcal women.
const CALORIE_FLOORS = { male: 1500, female: 1200 };
const CALORIE_ADJUSTMENTS = { lose: -400, maintain: 0, gain: 400 };

function calculateTargetCalories(tdee, goal, sex) {
  const adjusted = tdee + CALORIE_ADJUSTMENTS[goal];
  const floor = CALORIE_FLOORS[sex];
  return Math.round(Math.max(adjusted, floor));
}

// --- Macros ---
// Protein: 1.8 g/kg (middle of 1.6-2.2 range).
// Fat: 25% of calories (middle of 20-30% range).
// Carbs: remainder.
function calculateMacros(targetCalories, weight) {
  const proteinGrams = Math.round(weight * 1.8);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const proteinCals = proteinGrams * 4;
  const fatCals = fatGrams * 9;
  const carbCals = targetCalories - proteinCals - fatCals;
  const carbGrams = Math.round(Math.max(carbCals, 0) / 4);

  return {
    protein: { grams: proteinGrams, percent: Math.round((proteinCals / targetCalories) * 100) },
    fat: { grams: fatGrams, percent: Math.round((fatCals / targetCalories) * 100) },
    carbs: { grams: carbGrams, percent: Math.round((Math.max(carbCals, 0) / targetCalories) * 100) },
  };
}

// --- Advice ---
function generateAdvice(goal, bmiCategory, age) {
  const bmiSections = {
    underweight: {
      type: 'warning',
      headline: 'Your BMI is below the healthy range (18.5–24.9)',
      tips: [
        'Focus on nutrient-dense, calorie-rich foods — nuts, avocado, whole grains, legumes.',
        'Aim for 3 main meals and 2–3 snacks daily to build a steady calorie surplus.',
        'Prioritise protein at every meal to support healthy weight gain and muscle.',
        'Speak with a doctor or registered dietitian for personalised guidance.',
      ],
    },
    normal: {
      type: 'success',
      headline: 'Your BMI is in the healthy range — great work!',
      tips: [
        'Consistent meal timing and adequate protein help sustain energy and body composition.',
        'Regular physical activity protects your weight and overall health long term.',
      ],
    },
    overweight: {
      type: 'warning',
      headline: 'Your BMI is in the overweight range',
      tips: [
        'Even a 5–10% reduction in body weight significantly improves energy, joints, and heart health.',
        'A moderate deficit of 300–500 kcal/day is sustainable and avoids muscle loss.',
        'Prioritise vegetables, lean protein, and whole grains to feel fuller with fewer calories.',
        'Adding 30 minutes of moderate activity most days makes a meaningful difference.',
      ],
    },
    obese: {
      type: 'danger',
      headline: 'Your BMI is in the obese range',
      tips: [
        'We recommend consulting your doctor or a dietitian before making major dietary changes.',
        'Even a 5% reduction in body weight can significantly lower risk of diabetes, heart disease, and joint pain.',
        'Focus on sustainability — small consistent daily habits are more powerful than extreme diets.',
        'Every healthy meal is a step forward. Progress matters far more than perfection.',
        'Track energy levels, sleep quality, and mood alongside calories for a fuller health picture.',
      ],
    },
  };

  const goalTips = {
    lose: [
      'A moderate calorie deficit is the most sustainable approach to fat loss.',
      'Prioritising protein preserves muscle while in a deficit.',
      'Slow, steady progress (0.5–1 kg/week) is far more maintainable than rapid loss.',
    ],
    maintain: [
      'Maintaining weight is about matching your energy intake to your output.',
      'Consistent meal timing and high-protein foods support long-term satiety.',
      'Small adjustments over time are more effective than big restrictions.',
    ],
    gain: [
      'A moderate surplus (300–500 kcal above TDEE) supports muscle growth without excess fat.',
      'Distribute protein evenly across meals to maximise muscle protein synthesis.',
      'Strength training alongside adequate calories drives quality, lean mass gains.',
    ],
  };

  let ageTips = null;
  if (typeof age === 'number' && age < 18) {
    ageTips = {
      headline: 'Advice for Young People',
      tips: [
        'Young bodies are still developing — avoid extreme calorie restriction.',
        'Focus on balanced, nutritious meals that fuel both your body and mind.',
        'Regular physical activity now builds lifelong habits and stronger bones.',
      ],
    };
  } else if (typeof age === 'number' && age >= 40 && age < 60) {
    ageTips = {
      headline: 'Advice for Your Life Stage (40s & 50s)',
      tips: [
        'Metabolism slows by only 1–2% per decade — very manageable with consistent habits.',
        'Strength training 2–3× per week is the best way to maintain muscle and metabolic rate.',
        'Protein needs increase with age — aim for the higher end of your target to protect muscle.',
        'Prioritising 7–9 hours of sleep and managing stress is as important as diet.',
        'Many people achieve their best health in their 40s and 50s — you are right on time.',
      ],
    };
  } else if (typeof age === 'number' && age >= 60) {
    ageTips = {
      headline: 'Advice for Your Life Stage (60+)',
      tips: [
        'Staying active is the single most powerful factor for healthy ageing — even gentle walking counts.',
        'Protein is critical after 60 to prevent muscle loss. Aim for 1.6–2 g per kg of body weight.',
        'Focus on nutrient-dense foods to meet your vitamin D, calcium, and B12 needs.',
        'Hydration is often underestimated — aim for 6–8 glasses of water every day.',
        'It is never too late to improve your health. Consistent small steps create lasting change.',
      ],
    };
  }

  return {
    bmiAlert: bmiSections[bmiCategory] || null,
    goalTips: goalTips[goal] || [],
    ageTips,
  };
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  getBMICategory,
  calculateTargetCalories,
  calculateMacros,
  generateAdvice,
  ACTIVITY_FACTORS,
};
