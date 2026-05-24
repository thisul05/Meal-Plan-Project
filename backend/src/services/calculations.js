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
function generateAdvice(goal, bmiCategory) {
  const lines = {
    lose: [
      'A moderate calorie deficit is a sustainable approach to fat loss.',
      'Prioritising protein will help preserve muscle while in a deficit.',
      'Aim for consistent daily habits — slow progress beats quick fixes.',
    ],
    maintain: [
      'Maintaining weight is about matching your energy intake to your output.',
      'Consistent meal timing and high-protein foods support satiety.',
      'Small adjustments over time are more effective than big restrictions.',
    ],
    gain: [
      'A moderate surplus supports muscle growth without excessive fat gain.',
      'Distributing protein across meals maximises muscle protein synthesis.',
      'Strength training alongside adequate calories drives quality gains.',
    ],
  };

  const advice = lines[goal] || [];

  if (bmiCategory === 'underweight') {
    advice.push('Your BMI suggests you may benefit from discussing your goals with a healthcare professional.');
  }

  return advice;
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
