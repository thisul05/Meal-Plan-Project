const calculations = require('../services/calculations');

// POST /api/nutrition/calculate
// Input is already validated by middleware — this just orchestrates the service calls.
async function calculate(req, res, next) {
  try {
    const { age, weight, height, sex, activityLevel, goal } = req.body;

    const bmr = calculations.calculateBMR(age, weight, height, sex);
    const tdee = calculations.calculateTDEE(bmr, activityLevel);
    const bmi = calculations.calculateBMI(weight, height);
    const bmiCategory = calculations.getBMICategory(bmi);
    const targetCalories = calculations.calculateTargetCalories(tdee, goal, sex);
    const macros = calculations.calculateMacros(targetCalories, weight);
    const advice = calculations.generateAdvice(goal, bmiCategory);

    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      targetCalories,
      macros,
      advice,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { calculate };
