// Input validation middleware for /api/nutrition/calculate
// Runs before the controller so the controller always receives clean data.
function validateNutritionInput(req, res, next) {
  const { age, weight, height, sex, activityLevel, goal } = req.body;

  const errors = [];

  if (!Number.isInteger(age) || age < 10 || age > 120) {
    errors.push('age must be a whole number between 10 and 120');
  }

  if (typeof weight !== 'number' || weight < 20 || weight > 300) {
    errors.push('weight must be a number between 20 and 300 kg');
  }

  if (typeof height !== 'number' || height < 50 || height > 280) {
    errors.push('height must be a number between 50 and 280 cm');
  }

  if (!['male', 'female'].includes(sex)) {
    errors.push('sex must be "male" or "female"');
  }

  const validLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
  if (!validLevels.includes(activityLevel)) {
    errors.push(`activityLevel must be one of: ${validLevels.join(', ')}`);
  }

  const validGoals = ['lose', 'maintain', 'gain'];
  if (!validGoals.includes(goal)) {
    errors.push(`goal must be one of: ${validGoals.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateNutritionInput };
