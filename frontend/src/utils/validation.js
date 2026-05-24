// Client-side validation — catches obvious errors before a network round-trip.
// Mirror the rules in backend/src/middleware/validate.js.

export function validateProfileForm({ age, weight, height, sex, activityLevel, goal }) {
  const errors = {};

  const ageNum = Number(age);
  if (!age || isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 10 || ageNum > 120) {
    errors.age = 'Enter a whole number between 10 and 120';
  }

  const weightNum = Number(weight);
  if (!weight || isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
    errors.weight = 'Enter a weight between 20 and 300 kg';
  }

  const heightNum = Number(height);
  if (!height || isNaN(heightNum) || heightNum < 50 || heightNum > 280) {
    errors.height = 'Enter a height between 50 and 280 cm';
  }

  if (!['male', 'female'].includes(sex)) {
    errors.sex = 'Please select a sex';
  }

  const validLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
  if (!validLevels.includes(activityLevel)) {
    errors.activityLevel = 'Please select an activity level';
  }

  const validGoals = ['lose', 'maintain', 'gain'];
  if (!validGoals.includes(goal)) {
    errors.goal = 'Please select a goal';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
